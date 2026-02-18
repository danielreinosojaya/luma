import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: parseInt(process.env.BREVO_SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
      ...payload,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export const emailTemplates = {
  appointmentConfirmation: (
    clientName: string,
    serviceName: string,
    appointmentDate: string,
    appointmentTime: string,
    staffName: string
  ) => `
    <h2>¡Cita Confirmada!</h2>
    <p>Hola ${clientName},</p>
    <p>Tu cita en <strong>Luma</strong> ha sido confirmada exitosamente.</p>
    <div style="background: #f5ede4; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Servicio:</strong> ${serviceName}</p>
      <p><strong>Fecha:</strong> ${appointmentDate}</p>
      <p><strong>Hora:</strong> ${appointmentTime}</p>
      <p><strong>Especialista:</strong> ${staffName}</p>
    </div>
    <p>Si necesitas cancelar o reprogramar, contacta con nosotros al menos 24 horas antes.</p>
    <p>¡La belleza también es calma! 💆‍♀️</p>
  `,

  appointmentReminder: (
    clientName: string,
    serviceName: string,
    appointmentTime: string
  ) => `
    <h2>Recordatorio de Cita</h2>
    <p>Hola ${clientName},</p>
    <p>Te recordamos que tienes una cita mañana a las <strong>${appointmentTime}</strong> para <strong>${serviceName}</strong>.</p>
    <p>¡No olvides llegar 10 minutos antes!</p>
  `,

  appointmentCancellation: (
    clientName: string,
    serviceName: string,
    appointmentDate: string
  ) => `
    <h2>Cita Cancelada</h2>
    <p>Hola ${clientName},</p>
    <p>Tu cita para ${serviceName} el ${appointmentDate} ha sido cancelada.</p>
    <p>Si deseas reagendarla, no dudes en contactarnos.</p>
  `,

  followupPostService: (
    clientName: string,
    serviceName: string
  ) => `
    <h2>¿Cómo fue tu experiencia?</h2>
    <p>Hola ${clientName},</p>
    <p>Esperamos que hayas disfrutado tu cita de ${serviceName} con nosotros.</p>
    <p>Tu satisfacción es nuestra prioridad. Si tienes comentarios, por favor responde a este email.</p>
    <p>¡Nos vería pronto! 💆‍♀️</p>
  `,
};
