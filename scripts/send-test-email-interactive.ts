/**
 * Cliente interactivo para enviar correos de prueba (CLI)
 *
 * Uso: npx tsx scripts/send-test-email-interactive.ts
 */

import * as readline from "readline";
import nodemailer from "nodemailer";

type NotificationType =
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "staff_update"
  | "promotion"
  | "password_reset";

const notificationTypes: NotificationType[] = [
  "appointment_confirmed",
  "appointment_reminder",
  "appointment_cancelled",
  "appointment_rescheduled",
  "staff_update",
  "promotion",
  "password_reset",
];

const notificationLabels: Record<NotificationType, string> = {
  appointment_confirmed: "✅ Confirmación de Cita",
  appointment_reminder: "⏰ Recordatorio de Cita",
  appointment_cancelled: "❌ Cancelación de Cita",
  appointment_rescheduled: "📅 Cita Reprogramada",
  staff_update: "👩 Actualización del Equipo",
  promotion: "🎉 Promoción/Oferta",
  password_reset: "🔐 Restablecimiento de Contraseña",
};

// Crear interfaz readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper para preguntar en CLI
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Obtener transporte Ethereal
async function getTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Templates de correos
function getEmailTemplate(type: NotificationType) {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; color: #2C2623; }
      .container { max-width: 600px; margin: 0 auto; border: 1px solid #E8DDD7; border-radius: 12px; }
      .header { background: linear-gradient(135deg, #C4956F 0%, #A67C52 100%); padding: 40px 20px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { padding: 30px 20px; }
      .info-block { background: #FAF8F6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C4956F; }
      .button { display: inline-block; background: #C4956F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; }
      .footer { background: #F5F1EB; padding: 20px; text-align: center; color: #8B7862; font-size: 12px; }
      .detail { margin: 10px 0; }
    </style>
  `;

  const templates: Record<NotificationType, { subject: string; html: string }> = {
    appointment_confirmed: {
      subject: "✅ Tu cita ha sido confirmada - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>¡Cita Confirmada!</h1></div><div class="content"><p>Tu cita ha sido confirmada:</p><div class="info-block"><div class="detail"><strong>📅 Fecha:</strong> 15 febrero, 2026</div><div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div><div class="detail"><strong>💇 Servicio:</strong> Blow & Glow ($15.99)</div><div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div><div class="detail"><strong>📍 Ubicación:</strong> Quito, Ecuador</div></div><a href="https://luma.vercel.app" class="button">Ver Tu Reserva</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    appointment_reminder: {
      subject: "⏰ Recordatorio: Tu cita es mañana - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>⏰ ¡Tu cita es mañana!</h1></div><div class="content"><p>Tu cita es mañana 15 febrero a las 10:30 AM con Valentina.</p><div class="info-block"><div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div><div class="detail"><strong>⏰ Hora:</strong> 10:30 AM</div></div><p>Por favor, llega 5 minutos antes.</p><a href="https://luma.vercel.app" class="button">Confirmar Asistencia</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    appointment_cancelled: {
      subject: "❌ Tu cita ha sido cancelada - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>Cita Cancelada</h1></div><div class="content"><p>Tu cita del 15 febrero ha sido cancelada.</p><div class="info-block"><div class="detail"><strong>❌ Estado:</strong> Cancelada</div><div class="detail"><strong>🕐 Hora anterior:</strong> 10:30 AM</div></div><p>Puedes crear una nueva cita desde nuestra plataforma.</p><a href="https://luma.vercel.app" class="button">Crear Nueva Cita</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    appointment_rescheduled: {
      subject: "📅 Tu cita ha sido reprogramada - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>📅 Cita Reprogramada</h1></div><div class="content"><p>Tu cita ha sido movida a una nueva fecha:</p><div class="info-block"><div class="detail"><strong>📅 Anterior:</strong> 15 febrero → <strong>18 febrero</strong></div><div class="detail"><strong>🕐 Hora:</strong> 2:00 PM (era 10:30 AM)</div></div><a href="https://luma.vercel.app" class="button">Confirmar Nueva Fecha</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    staff_update: {
      subject: "👩 Actualización: Cambios en nuestro equipo - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>Cambios en Nuestro Equipo</h1></div><div class="content"><p>¡Noticias emocionantes!</p><div class="info-block"><div class="detail"><strong>✨ Nuevo Servicio:</strong> Extensiones de Pestañas</div><div class="detail"><strong>👩 Nuevo Personal:</strong> Catalina, especialista en uñas</div><div class="detail"><strong>⏰ Nuevos Horarios:</strong> Ahora abierto sábados hasta las 5 PM</div></div><a href="https://luma.vercel.app" class="button">Ver Disponibilidad</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    promotion: {
      subject: "🎉 Oferta Especial: 20% Descuento - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>🎉 ¡Oferta Especial!</h1></div><div class="content"><p>20% de descuento en todos nuestros paquetes combo:</p><div class="info-block"><div class="detail">Luma Queen: $28 → $22.40</div><div class="detail">Iconic Nails: $18.99 → $15.19</div><div class="detail">Glam Reset: $18 → $14.40</div><div class="detail"><strong>⏰ Válido hasta:</strong> 21 de febrero</div></div><a href="https://luma.vercel.app" class="button">Ver Ofertas</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
    password_reset: {
      subject: "🔐 Restablece tu contraseña - Luma",
      html: `${baseStyle}<div class="container"><div class="header"><h1>Restablecer Contraseña</h1></div><div class="content"><p>Haz clic en el botón para restablecer tu contraseña. Este enlace expira en 1 hora.</p><a href="https://luma.vercel.app/reset-password" class="button">Restablecer Contraseña</a></div><div class="footer">Luma | Quito, Ecuador</div></div>`,
    },
  };

  return templates[type];
}

// Función principal interactiva
async function main() {
  console.clear();
  console.log("\n📧 === LUMA - SISTEMA DE NOTIFICACIONES ===\n");

  try {
    // 1. Seleccionar tipo de notificación
    console.log("🎯 Tipos de notificación disponibles:\n");
    notificationTypes.forEach((type, idx) => {
      console.log(`   ${idx + 1}. ${notificationLabels[type]}`);
    });

    const typeIndex = await question(
      "\nSelecciona un tipo (1-7): "
    );
    const selectedIdx = parseInt(typeIndex) - 1;

    if (selectedIdx < 0 || selectedIdx >= notificationTypes.length) {
      console.log("\n❌ Opción inválida");
      rl.close();
      return;
    }

    const notificationType = notificationTypes[selectedIdx];

    // 2. Ingresar correo destinatario
    const recipientEmail = await question(
      "\n📧 Ingresa el correo destinatario (ej: danielreinosojaya@gmail.com): "
    );

    if (!recipientEmail.includes("@")) {
      console.log("\n❌ Correo inválido");
      rl.close();
      return;
    }

    // 3. Confirmar antes de enviar
    console.log(`\n✨ Preparando envío:`);
    console.log(`   • Notificación: ${notificationLabels[notificationType]}`);
    console.log(`   • Destinatario: ${recipientEmail}`);

    const confirm = await question(
      "\n¿Continuar con el envío? (s/n): "
    );

    if (confirm.toLowerCase() !== "s") {
      console.log("\n❌ Envío cancelado");
      rl.close();
      return;
    }

    // 4. Enviar correo
    console.log("\n⏳ Enviando correo...\n");

    const template = getEmailTemplate(notificationType);
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"Luma" <noreply@luma-beauty.ec>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    // 5. Mostrar resultado
    console.log("✅ ¡Correo enviado exitosamente!\n");
    console.log(`📧 ID del Correo: ${info.messageId}`);
    console.log(`\n🔗 Ver previsualización en navegador:`);
    console.log(`   ${previewUrl}\n`);

    console.log("📌 Nota: El enlace expira en 48 horas\n");
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : String(error));
  } finally {
    rl.close();
  }
}

// Ejecutar
main();
