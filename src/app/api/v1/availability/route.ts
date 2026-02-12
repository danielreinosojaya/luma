import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware";

// GET /api/v1/availability — Auth required (any role can check)
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get("staffId");
    const date = searchParams.get("date"); // YYYY-MM-DD
    const serviceIds = searchParams.getAll("serviceIds");

    if (!staffId || !date || serviceIds.length === 0) {
      return NextResponse.json(
        apiError(
          "Missing parameters: staffId, date, serviceIds",
          "VALIDATION_ERROR"
        ),
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        apiError("Invalid date format. Use YYYY-MM-DD", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Limit serviceIds to prevent abuse
    if (serviceIds.length > 20) {
      return NextResponse.json(
        apiError("Maximum 20 services per query", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Business rule: cannot check past dates
    const targetDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return NextResponse.json(
        apiSuccess({ slots: [], message: "Cannot check availability for past dates" })
      );
    }

    // Get staff member
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        user: { select: { name: true, active: true } },
        schedules: true,
      },
    });

    if (!staff || !staff.user.active) {
      return NextResponse.json(
        apiError("Staff member not found or inactive", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Get day-of-week schedule
    const dayOfWeek = targetDate.getDay();
    const schedule = staff.schedules.find(
      (s: any) => s.dayOfWeek === dayOfWeek
    );

    if (!schedule || !schedule.isAvailable) {
      return NextResponse.json(
        apiSuccess({ slots: [], message: "Staff not available on this day" })
      );
    }

    // Calculate total duration needed
    const servicesData = await db.service.findMany({
      where: { id: { in: serviceIds }, active: true },
      select: { durationMin: true },
    });

    const durationNeeded = servicesData.reduce(
      (sum: number, s: any) => sum + s.durationMin,
      0
    );

    if (durationNeeded <= 0) {
      return NextResponse.json(
        apiError("No valid services found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Get existing appointments for that day (single DB query)
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await db.appointment.findMany({
      where: {
        staffId,
        startAt: { gte: dayStart, lte: dayEnd },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      select: { startAt: true, endAt: true },
      orderBy: { startAt: "asc" },
    });

    // Optimised slot generation: merge busy intervals then find gaps
    const [startHour, startMin] = schedule.startTime.split(":").map(Number);
    const [endHour, endMin] = schedule.endTime.split(":").map(Number);
    const scheduleStart = startHour * 60 + startMin;
    const scheduleEnd = endHour * 60 + endMin;

    // Convert appointments to minute-of-day ranges
    const busy = existingAppointments.map((a: any) => ({
      start: a.startAt.getHours() * 60 + a.startAt.getMinutes(),
      end: a.endAt.getHours() * 60 + a.endAt.getMinutes(),
    }));

    // Generate available 15-min slots
    const slots: { startAt: string; endAt: string }[] = [];

    for (
      let minutes = scheduleStart;
      minutes + durationNeeded <= scheduleEnd;
      minutes += 15
    ) {
      const slotEnd = minutes + durationNeeded;

      const hasConflict = busy.some(
        (b: any) => minutes < b.end && slotEnd > b.start
      );

      if (!hasConflict) {
        const s = new Date(targetDate);
        s.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
        const e = new Date(targetDate);
        e.setHours(Math.floor(slotEnd / 60), slotEnd % 60, 0, 0);

        slots.push({ startAt: s.toISOString(), endAt: e.toISOString() });
      }
    }

    return NextResponse.json(
      apiSuccess({
        staffId,
        staffName: staff.user.name,
        date,
        durationMin: durationNeeded,
        slots,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/availability error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});
