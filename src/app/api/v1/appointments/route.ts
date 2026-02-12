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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientEmail = searchParams.get("clientEmail");

    if (!clientEmail) {
      return NextResponse.json(
        apiError("Missing clientEmail parameter", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const appointments = await db.appointment.findMany({
      where: {
        client: {
          email: clientEmail,
        },
      },
      include: {
        staff: {
          include: {
            user: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        payment: true,
      },
      orderBy: {
        startAt: "desc",
      },
    });

    return NextResponse.json(apiSuccess(appointments));
  } catch (error) {
    console.error("GET /api/v1/appointments error:", error);
    return NextResponse.json(
      apiError("Error fetching appointments", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v || [],
        ])
      );
      return NextResponse.json(validationError(errors), { status: 400 });
    }

    const data = parsed.data as CreateAppointmentInput;

    // Idempotency check
    const cachedResponse = await getIdempotencyResponse(data.idempotencyKey);
    if (cachedResponse) {
      return NextResponse.json(apiSuccess(cachedResponse));
    }

    // Get or create client
    let client = await db.client.findUnique({
      where: { email: data.clientEmail },
    });

    if (!client) {
      client = await db.client.create({
        data: {
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone,
        },
      });
    }

    // Verify staff exists
    const staff = await db.staff.findUnique({
      where: { id: data.staffId },
      include: { user: true },
    });

    if (!staff) {
      return NextResponse.json(
        apiError("Staff member not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Verify services exist
    const services = await db.service.findMany({
      where: {
        id: {
          in: data.serviceIds,
        },
      },
    });

    if (services.length !== data.serviceIds.length) {
      return NextResponse.json(
        apiError("One or more services not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Check availability (prevent double-booking)
    const startAt = new Date(data.startAt);
    const durationMin = services.reduce((sum, s) => sum + s.durationMin, 0);
    const endAt = new Date(startAt.getTime() + durationMin * 60000);

    const conflicts = await db.appointment.findMany({
      where: {
        staffId: data.staffId,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
        status: {
          in: ["CONFIRMED", "PENDING"],
        },
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        apiError("Time slot not available", "CONFLICT"),
        { status: 409 }
      );
    }

    // Create appointment in transaction
    const appointment = await db.appointment.create({
      data: {
        clientId: client.id,
        staffId: data.staffId,
        comboId: data.comboId,
        startAt,
        endAt,
        notes: data.notes,
        idempotencyKey: data.idempotencyKey,
        services: {
          create: services.map((service) => ({
            serviceId: service.id,
            priceAtBooking: service.price,
          })),
        },
      },
      include: {
        services: {
          include: { service: true },
        },
        staff: { include: { user: true } },
      },
    });

    // Send confirmation email
    const serviceNames = services.map((s) => s.name).join(", ");
    const confirmEmailSent = await sendEmail({
      to: data.clientEmail,
      subject: "¡Cita Confirmada en Luma Beauty Studio!",
      html: emailTemplates.appointmentConfirmation(
        data.clientName,
        serviceNames,
        startAt.toLocaleDateString("es-EC"),
        startAt.toLocaleTimeString("es-EC", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        staff.user.name || "Staff"
      ),
    });

    if (!confirmEmailSent) {
      console.warn(`Email confirmation failed for ${data.clientEmail}`);
    }

    // Log audit
    await logAudit({
      userId: "system", // TODO: Get from auth session
      action: "CREATE",
      entity: "Appointment",
      entityId: appointment.id,
    });

    // Cache response
    await cacheIdempotencyResponse(data.idempotencyKey, appointment);

    return NextResponse.json(apiSuccess(appointment), { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/appointments error:", error);
    return NextResponse.json(
      apiError("Error creating appointment", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
