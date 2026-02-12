import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";
import { sendEmail, emailTemplates } from "@/lib/email/brevo";
import { logAudit } from "@/lib/security/audit";
import {
  withAuth,
  getClientIp,
  type AuthenticatedRequest,
} from "@/lib/auth/middleware";

// POST /api/v1/appointments/[id] — Cancel appointment
// Auth: Required
// RBAC: ADMIN can cancel any. STAFF can cancel own assigned. CLIENT can cancel own.

export const POST = withAuth(
  async (
    request: AuthenticatedRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await context.params;
      const ip = getClientIp(request);
      const body = await request.json();
      const reason =
        typeof body.reason === "string" ? body.reason.slice(0, 500) : undefined;

      // Get appointment with ownership data
      const appointment = await db.appointment.findUnique({
        where: { id },
        include: {
          client: { select: { id: true, name: true, email: true } },
          staff: { select: { id: true } },
          services: { include: { service: true } },
        },
      });

      if (!appointment) {
        return NextResponse.json(
          apiError("Appointment not found", "NOT_FOUND"),
          { status: 404 }
        );
      }

      // Ownership check: CLIENT can only cancel their own
      if (request.auth.role === "CLIENT") {
        if (appointment.client.id !== request.auth.clientId) {
          return NextResponse.json(
            apiError("You do not have access to this appointment", "FORBIDDEN"),
            { status: 403 }
          );
        }
      }

      // STAFF can only cancel appointments assigned to them
      if (request.auth.role === "STAFF") {
        if (appointment.staff.id !== request.auth.staffId) {
          return NextResponse.json(
            apiError("You can only cancel your own assigned appointments", "FORBIDDEN"),
            { status: 403 }
          );
        }
      }

      // Business rule: cannot cancel completed or already cancelled
      if (["COMPLETED", "CANCELLED"].includes(appointment.status)) {
        return NextResponse.json(
          apiError(
            `Cannot cancel an appointment with status "${appointment.status}"`,
            "CONFLICT"
          ),
          { status: 409 }
        );
      }

      // Atomic update + audit
      const updated = await db.$transaction(async (tx: any) => {
        const apt = await tx.appointment.update({
          where: { id },
          data: {
            status: "CANCELLED",
            notes: reason ? `Cancelled: ${reason}` : "Cancelled by user",
          },
          include: {
            client: { select: { id: true, name: true, email: true } },
            services: { include: { service: true } },
          },
        });

        await tx.auditLog.create({
          data: {
            userId: request.auth.userId,
            staffId: request.auth.staffId,
            action: "UPDATE",
            entity: "Appointment",
            entityId: id,
            changes: JSON.stringify({ status: "CANCELLED", reason }),
            ipAddress: ip,
          },
        });

        return apt;
      });

      // Fire-and-forget cancellation email
      const serviceNames = updated.services
        .map((s: any) => s.service.name)
        .join(", ");
      sendEmail({
        to: updated.client.email,
        subject: "Cita Cancelada - Luma Beauty Studio",
        html: emailTemplates.appointmentCancellation(
          updated.client.name,
          serviceNames,
          updated.startAt.toLocaleDateString("es-EC")
        ),
      }).catch((err) => console.error("Cancellation email failed:", err));

      return NextResponse.json(apiSuccess(updated));
    } catch (error) {
      console.error("POST /api/v1/appointments/[id]/cancel error:", error);
      return NextResponse.json(
        apiError("An unexpected error occurred", "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
  }
);
