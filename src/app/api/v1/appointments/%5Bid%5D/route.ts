import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api/response";
import { sendEmail, emailTemplates } from "@/lib/email/brevo";
import { logAudit } from "@/lib/security/audit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { reason } = body;

    // Get appointment
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        services: {
          include: { service: true },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        apiError("Appointment not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Check if can be cancelled (not already completed or cancelled)
    if (["COMPLETED", "CANCELLED"].includes(appointment.status)) {
      return NextResponse.json(
        apiError("Cannot cancel this appointment", "CONFLICT"),
        { status: 409 }
      );
    }

    // Update status
    const updated = await db.appointment.update({
      where: { id },
      data: {
        status: "CANCELLED",
        notes: reason ? `Cancelled: ${reason}` : "Cancelled",
      },
      include: {
        client: true,
        services: {
          include: { service: true },
        },
      },
    });

    // Send cancellation email
    const serviceNames = updated.services.map((s) => s.service.name).join(", ");
    await sendEmail({
      to: updated.client.email,
      subject: "Cita Cancelada - Luma Beauty Studio",
      html: emailTemplates.appointmentCancellation(
        updated.client.name,
        serviceNames,
        updated.startAt.toLocaleDateString("es-EC")
      ),
    });

    // Log audit
    await logAudit({
      userId: "system", // TODO: Get from auth session
      action: "UPDATE",
      entity: "Appointment",
      entityId: id,
      changes: { status: "CANCELLED", reason },
    });

    return NextResponse.json(apiSuccess(updated));
  } catch (error) {
    console.error("POST /api/v1/appointments/[id]/cancel error:", error);
    return NextResponse.json(
      apiError("Error cancelling appointment", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
