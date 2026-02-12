import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get("staffId");
    const date = searchParams.get("date"); // YYYY-MM-DD
    const serviceIds = searchParams.getAll("serviceIds");

    if (!staffId || !date || serviceIds.length === 0) {
      return NextResponse.json(
        apiError("Missing parameters: staffId, date, serviceIds", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Get staff member
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        schedules: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!staff) {
      return NextResponse.json(
        apiError("Staff member not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Parse date and get day of week
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Get staff schedule for that day
    const schedule = staff.schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule || !schedule.isAvailable) {
      return NextResponse.json(
        apiSuccess({
          slots: [],
          message: "Staff not available on this day",
        })
      );
    }

    // Calculate duration needed (sum of requested services)
    const totalDurationMin = await db.service.aggregate({
      _sum: {
        durationMin: true,
      },
      where: {
        id: {
          in: serviceIds,
        },
      },
    });

    const durationNeeded = totalDurationMin._sum.durationMin || 0;

    // Get existing appointments for that day
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await db.appointment.findMany({
      where: {
        staffId,
        startAt: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ["CONFIRMED", "PENDING", "COMPLETED"],
        },
      },
    });

    // Generate available slots (15-min intervals)
    const [startHour, startMin] = schedule.startTime.split(":").map(Number);
    const [endHour, endMin] = schedule.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const slots = [];

    for (let minutes = startMinutes; minutes + durationNeeded <= endMinutes; minutes += 15) {
      const slotStart = new Date(targetDate);
      slotStart.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationNeeded);

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(
        (apt) =>
          slotStart < apt.endAt && slotEnd > apt.startAt
      );

      if (!hasConflict) {
        slots.push({
          startAt: slotStart.toISOString(),
          endAt: slotEnd.toISOString(),
        });
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
      apiError("Error checking availability", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
