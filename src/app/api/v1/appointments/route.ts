import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import {
  createAppointmentSchema,
  type CreateAppointmentInput,
} from "@/lib/validators/schemas";
import {
  getIdempotencyResponse,
  cacheIdempotencyResponse,
} from "@/lib/security/idempotency";
import { sendEmail, emailTemplates } from "@/lib/email/brevo";
import { logAudit } from "@/lib/security/audit";
import {
  withAuth,
  requireRole,
  getClientIp,
  type AuthenticatedRequest,
} from "@/lib/auth/middleware";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { encrypt } from "@/lib/security/crypto";

// ============= GET /api/v1/appointments =============
// Auth: Required
// RBAC: CLIENT sees own, STAFF sees assigned, ADMIN sees all
// Pagination: Required

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    // Build scoped query based on user role
    const where: any = {};

    if (request.auth.role === "CLIENT") {
      if (!request.auth.clientId) {
        return NextResponse.json(
          apiError("Client profile not found", "NOT_FOUND"),
          { status: 404 }
        );
      }
      where.clientId = request.auth.clientId;
    } else if (request.auth.role === "STAFF") {
      if (!request.auth.staffId) {
        return NextResponse.json(
          apiError("Staff profile not found", "NOT_FOUND"),
          { status: 404 }
        );
      }
      where.staffId = request.auth.staffId;
    }
    // ADMIN: no additional where clause — sees all

    if (status) {
      where.status = status;
    }

    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        take: limit,
        skip,
        include: {
          staff: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          client: { select: { id: true, name: true, email: true } },
          services: { include: { service: true } },
          payment: true,
        },
        orderBy: { startAt: "desc" },
      }),
      db.appointment.count({ where }),
    ]);

    return NextResponse.json(
      apiSuccess({
        items: appointments,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("GET /api/v1/appointments error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});

// ============= POST /api/v1/appointments =============
// Auth: Required
// RBAC: ADMIN, STAFF, CLIENT
// Protection: Rate limit, idempotency, atomic transaction, conflict check

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const ip = getClientIp(request);

    // Rate limit: 5 bookings per minute per user
    const { success: rlOk } = await checkRateLimit(
      `booking:${request.auth.userId}`,
      "booking"
    );
    if (!rlOk) {
      return NextResponse.json(
        apiError("Too many booking requests. Try again in a minute.", "RATE_LIMIT_EXCEEDED"),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v || []])
      );
      return NextResponse.json(validationError(errors), { status: 400 });
    }

    const data = parsed.data as CreateAppointmentInput;

    // Business rule: cannot book in the past
    const startAt = new Date(data.startAt);
    if (startAt <= new Date()) {
      return NextResponse.json(
        apiError("Cannot book appointments in the past", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Idempotency: return cached result if duplicate request
    const cachedResponse = await getIdempotencyResponse(data.idempotencyKey);
    if (cachedResponse) {
      return NextResponse.json(apiSuccess(cachedResponse));
    }

    // ===== ATOMIC TRANSACTION =====
    // All-or-nothing: client upsert, conflict check, appointment + services created together
    const appointment = await db.$transaction(async (tx: any) => {
      // 1. Upsert client
      let client = await tx.client.findUnique({
        where: { email: data.clientEmail.toLowerCase().trim() },
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            name: data.clientName.trim(),
            email: data.clientEmail.toLowerCase().trim(),
            phone: encrypt(data.clientPhone), // PII encrypted
          },
        });
      }

      // 2. Verify staff exists and is active
      const staff = await tx.staff.findUnique({
        where: { id: data.staffId },
        include: { user: { select: { active: true, name: true } } },
      });

      if (!staff || !staff.user.active) {
        throw new AppointmentError("Staff member not found or inactive", "NOT_FOUND", 404);
      }

      // 3. Verify all services exist and are active
      const services = await tx.service.findMany({
        where: { id: { in: data.serviceIds }, active: true },
      });

      if (services.length !== data.serviceIds.length) {
        throw new AppointmentError("One or more services not found or inactive", "NOT_FOUND", 404);
      }

      // 4. Calculate end time from service durations
      const durationMin = services.reduce((sum: number, s: any) => sum + s.durationMin, 0);
      const endAt = new Date(startAt.getTime() + durationMin * 60000);

      // 5. Check for conflicting appointments (race-condition safe inside transaction)
      const conflicts = await tx.appointment.findMany({
        where: {
          staffId: data.staffId,
          startAt: { lt: endAt },
          endAt: { gt: startAt },
          status: { in: ["CONFIRMED", "PENDING"] },
        },
      });

      if (conflicts.length > 0) {
        throw new AppointmentError("Time slot not available", "CONFLICT", 409);
      }

      // 6. Create appointment with services atomically
      const apt = await tx.appointment.create({
        data: {
          clientId: client.id,
          staffId: data.staffId,
          comboId: data.comboId,
          startAt,
          endAt,
          notes: data.notes?.slice(0, 500), // Hard limit notes length
          idempotencyKey: data.idempotencyKey,
          services: {
            create: services.map((service: any) => ({
              serviceId: service.id,
              priceAtBooking: service.price,
            })),
          },
        },
        include: {
          services: { include: { service: true } },
          staff: { include: { user: { select: { id: true, name: true } } } },
          client: { select: { id: true, name: true, email: true } },
        },
      });

      // 7. Audit log inside transaction
      await tx.auditLog.create({
        data: {
          userId: request.auth.userId,
          staffId: request.auth.staffId,
          action: "CREATE",
          entity: "Appointment",
          entityId: apt.id,
          changes: JSON.stringify({
            clientEmail: data.clientEmail,
            staffId: data.staffId,
            startAt: data.startAt,
            serviceIds: data.serviceIds,
          }),
          ipAddress: ip,
        },
      });

      return apt;
    });

    // Non-critical: send email outside transaction (fire-and-forget)
    const serviceNames = appointment.services
      .map((s: any) => s.service.name)
      .join(", ");

    sendEmail({
      to: data.clientEmail,
      subject: "¡Cita Confirmada en Luma Beauty Studio!",
      html: emailTemplates.appointmentConfirmation(
        data.clientName,
        serviceNames,
        startAt.toLocaleDateString("es-EC"),
        startAt.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
        appointment.staff.user.name || "Staff"
      ),
    }).catch((err) => console.error("Email send failed:", err));

    // Cache idempotency response
    await cacheIdempotencyResponse(data.idempotencyKey, appointment);

    return NextResponse.json(apiSuccess(appointment), { status: 201 });
  } catch (error) {
    if (error instanceof AppointmentError) {
      return NextResponse.json(apiError(error.message, error.code), {
        status: error.statusCode,
      });
    }
    console.error("POST /api/v1/appointments error:", error);
    return NextResponse.json(
      apiError("An unexpected error occurred", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
});

// ============= Error helper =============

class AppointmentError extends Error {
  constructor(
    message: string,
    public code: string & {},
    public statusCode: number
  ) {
    super(message);
    this.name = "AppointmentError";
  }
}
