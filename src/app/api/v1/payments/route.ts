import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { createPaymentSchema } from "@/lib/validators/schemas";
import {
  getIdempotencyResponse,
  cacheIdempotencyResponse,
} from "@/lib/security/idempotency";
import { logAudit } from "@/lib/security/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = createPaymentSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v || [],
        ])
      );
      return NextResponse.json(validationError(errors), { status: 400 });
    }

    const data = parsed.data;

    // Idempotency check
    const cachedResponse = await getIdempotencyResponse(data.idempotencyKey);
    if (cachedResponse) {
      return NextResponse.json(apiSuccess(cachedResponse));
    }

    // Get appointment
    const appointment = await db.appointment.findUnique({
      where: { id: data.appointmentId },
      include: {
        payment: true,
        services: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        apiError("Appointment not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Check if already paid
    if (appointment.payment) {
      return NextResponse.json(
        apiError("Payment already registered for this appointment", "CONFLICT"),
        { status: 409 }
      );
    }

    // Calculate amount
    const amount = appointment.services.reduce(
      (sum, s) => sum + s.priceAtBooking,
      0
    );

    // Create payment
    const payment = await db.payment.create({
      data: {
        appointmentId: data.appointmentId,
        amount,
        method: data.method,
        status: "PENDING", // Manual methods (CASH, TRANSFER) - marked as pending until verified
        notes: data.notes,
        idempotencyKey: data.idempotencyKey,
      },
    });

    // Update appointment status to CONFIRMED
    await db.appointment.update({
      where: { id: data.appointmentId },
      data: {
        status: "CONFIRMED",
      },
    });

    // Log audit
    await logAudit({
      userId: "system", // TODO: Get from auth session
      action: "CREATE",
      entity: "Payment",
      entityId: payment.id,
    });

    // Cache response
    await cacheIdempotencyResponse(data.idempotencyKey, payment);

    return NextResponse.json(apiSuccess(payment), { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/payments error:", error);
    return NextResponse.json(
      apiError("Error registering payment", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
