import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, validationError } from "@/lib/api/response";
import { createPaymentSchema } from "@/lib/validators/schemas";
import {
  getIdempotencyResponse,
  cacheIdempotencyResponse,
} from "@/lib/security/idempotency";
import { logAudit } from "@/lib/security/audit";
import {
  withAuth,
  requireRole,
  getClientIp,
  type AuthenticatedRequest,
} from "@/lib/auth/middleware";

// POST /api/v1/payments
// Auth: Required
// RBAC: ADMIN, STAFF only (clients don't process their own payments)

export const POST = withAuth(
  requireRole("ADMIN", "STAFF")(async (request: AuthenticatedRequest) => {
    try {
      const ip = getClientIp(request);
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

      // ===== ATOMIC TRANSACTION =====
      // Payment creation + appointment status update together
      const payment = await db.$transaction(async (tx: any) => {
        // 1. Get appointment with lock (inside transaction)
        const appointment = await tx.appointment.findUnique({
          where: { id: data.appointmentId },
          include: {
            payment: true,
            services: true,
          },
        });

        if (!appointment) {
          throw new PaymentError("Appointment not found", "NOT_FOUND", 404);
        }

        // 2. Check if already paid
        if (appointment.payment) {
          throw new PaymentError(
            "Payment already registered for this appointment",
            "CONFLICT",
            409
          );
        }

        // 3. Validate appointment status (only PENDING or CONFIRMED can be paid)
        if (!["PENDING", "CONFIRMED"].includes(appointment.status)) {
          throw new PaymentError(
            `Cannot process payment for appointment with status "${appointment.status}"`,
            "CONFLICT",
            409
          );
        }

        // 4. Calculate amount from service snapshots (trustworthy source)
        const amount = appointment.services.reduce(
          (sum: number, s: any) => sum + s.priceAtBooking,
          0
        );

        if (amount <= 0) {
          throw new PaymentError("Invalid payment amount", "VALIDATION_ERROR", 400);
        }

        // 5. Create payment
        const pay = await tx.payment.create({
          data: {
            appointmentId: data.appointmentId,
            amount,
            method: data.method,
            status: "PENDING",
            notes: data.notes?.slice(0, 500),
            idempotencyKey: data.idempotencyKey,
          },
        });

        // 6. Update appointment status
        await tx.appointment.update({
          where: { id: data.appointmentId },
          data: { status: "CONFIRMED" },
        });

        // 7. Audit log
        await tx.auditLog.create({
          data: {
            userId: request.auth.userId,
            staffId: request.auth.staffId,
            action: "CREATE",
            entity: "Payment",
            entityId: pay.id,
            changes: JSON.stringify({
              appointmentId: data.appointmentId,
              amount,
              method: data.method,
            }),
            ipAddress: ip,
          },
        });

        return pay;
      });

      // Cache idempotency response
      await cacheIdempotencyResponse(data.idempotencyKey, payment);

      return NextResponse.json(apiSuccess(payment), { status: 201 });
    } catch (error) {
      if (error instanceof PaymentError) {
        return NextResponse.json(apiError(error.message, error.code), {
          status: error.statusCode,
        });
      }
      console.error("POST /api/v1/payments error:", error);
      return NextResponse.json(
        apiError("An unexpected error occurred", "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
  })
);

class PaymentError extends Error {
  constructor(
    message: string,
    public code: string & {},
    public statusCode: number
  ) {
    super(message);
    this.name = "PaymentError";
  }
}
