/**
 * Script para generar previsualizaciones de correos de notificación
 * Guarda los correos como archivos HTML locales sin necesidad de SMTP
 *
 * Uso: npx tsx scripts/generate-email-samples.ts
 */

import * as fs from "fs";
import * as path from "path";

type NotificationType =
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "appointment_rescheduled"
  | "staff_update"
  | "promotion"
  | "password_reset";

const notificationLabels: Record<NotificationType, string> = {
  appointment_confirmed: "✅ Confirmación de Cita",
  appointment_reminder: "⏰ Recordatorio de Cita",
  appointment_cancelled: "❌ Cancelación de Cita",
  appointment_rescheduled: "📅 Cita Reprogramada",
  staff_update: "👩 Actualización del Equipo",
  promotion: "🎉 Promoción/Oferta",
  password_reset: "🔐 Restablecimiento de Contraseña",
};

function getEmailTemplate(type: NotificationType) {
  const baseStyle = `
    <style>
      * { margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #2C2623; background: #f5f5f5; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; border: 1px solid #E8DDD7; border-radius: 12px; overflow: hidden; background: white; }
      .header { background: linear-gradient(135deg, #C4956F 0%, #A67C52 100%); padding: 40px 20px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
      .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
      .content { padding: 30px 20px; }
      .content p { margin: 15px 0; line-height: 1.6; }
      .info-block { background: #FAF8F6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C4956F; }
      .detail { margin: 10px 0; font-size: 14px; }
      .detail strong { color: #2C2623; font-weight: 600; }
      .button { display: inline-block; background: #C4956F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; font-size: 14px; }
      .button:hover { background: #A67C52; }
      .footer { background: #F5F1EB; padding: 20px; text-align: center; color: #8B7862; font-size: 12px; }
      .footer a { color: #C4956F; text-decoration: none; }
      h2 { font-size: 18px; margin: 20px 0 10px 0; color: #2C2623; }
    </style>
  `;

  const templates: Record<NotificationType, { subject: string; html: string }> = {
    appointment_confirmed: {
      subject: "✅ Tu cita ha sido confirmada - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cita Confirmada</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Cita Confirmada!</h1>
              <p>Tu reserva en Luma Beauty Studio está lista</p>
            </div>
            <div class="content">
              <p>Hola <strong>María</strong>,</p>
              <p>Tu cita ha sido confirmada exitosamente. Aquí están los detalles:</p>
              <div class="info-block">
                <div class="detail"><strong>📅 Fecha:</strong> 15 de febrero, 2026</div>
                <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
                <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow (Cepillado + Cejas)</div>
                <div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div>
                <div class="detail"><strong>💰 Costo:</strong> $15.99</div>
                <div class="detail"><strong>📍 Ubicación:</strong> Quito, Pichincha</div>
              </div>
              <p>Por favor, llega 5 minutos antes de tu cita. Si necesitas cancelar o cambiar tu horario, notificanos con al menos 24 horas de anticipación.</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Ver Tu Reserva</a>
              <p style="color: #8B7862; margin-top: 30px;">¡Nos vemos pronto en Luma Beauty Studio!</p>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador<br>
              <a href="mailto:danielreinosojaya@gmail.com">Contáctanos</a>
            </div>
          </div>
        </body>
        </html>
      `,
    },

    appointment_reminder: {
      subject: "⏰ Recordatorio: Tu cita es mañana - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recordatorio de Cita</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ ¡Recordatorio de Cita!</h1>
              <p>Tu cita es mañana</p>
            </div>
            <div class="content">
              <p>Hola <strong>María</strong>,</p>
              <p>Solo te recordamos que tienes una cita programada para mañana:</p>
              <div class="info-block">
                <div class="detail"><strong>📅 Mañana 15 de febrero</strong></div>
                <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
                <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
                <div class="detail"><strong>👩 Con:</strong> Valentina</div>
              </div>
              <p>✅ Por favor, confirma tu asistencia</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Confirmar Cita</a>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador
            </div>
          </div>
        </body>
        </html>
      `,
    },

    appointment_cancelled: {
      subject: "❌ Tu cita ha sido cancelada - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cita Cancelada</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cita Cancelada</h1>
              <p>Tu reserva ha sido cancelada</p>
            </div>
            <div class="content">
              <p>Hola <strong>María</strong>,</p>
              <p>Tu cita ha sido cancelada:</p>
              <div class="info-block">
                <div class="detail"><strong>📅 Fecha:</strong> 15 de febrero, 2026</div>
                <div class="detail"><strong>🕐 Hora:</strong> 10:30 AM</div>
                <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
                <div class="detail"><strong>❌ Estado:</strong> Cancelada</div>
              </div>
              <p>Si fue por error, puedes crear una nueva cita desde nuestra plataforma.</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Crear Nueva Cita</a>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador
            </div>
          </div>
        </body>
        </html>
      `,
    },

    appointment_rescheduled: {
      subject: "📅 Tu cita ha sido reprogramada - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cita Reprogramada</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Cita Reprogramada</h1>
              <p>Tu nueva fecha está lista</p>
            </div>
            <div class="content">
              <p>Hola <strong>María</strong>,</p>
              <p>Tu cita ha sido reprogramada a una nueva fecha:</p>
              <div class="info-block">
                <div class="detail"><strong>📅 Fecha Original:</strong> 15 febrero → <strong>18 febrero, 2026</strong></div>
                <div class="detail"><strong>🕐 Hora:</strong> 2:00 PM (era 10:30 AM)</div>
                <div class="detail"><strong>💇 Servicio:</strong> Blow & Glow</div>
                <div class="detail"><strong>👩 Esteticiente:</strong> Valentina</div>
              </div>
              <p>Por favor, confirma que este nuevo horario te conviene.</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Confirmar Nueva Fecha</a>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador
            </div>
          </div>
        </body>
        </html>
      `,
    },

    staff_update: {
      subject: "👩 Actualización: Cambios en nuestro equipo - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cambios en el Equipo</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cambios en Nuestro Equipo</h1>
              <p>Nos alegra compartirte noticias nuevas</p>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>¡Noticias emocionantes! Nuestro equipo en Luma Beauty Studio ha crecido:</p>
              <div class="info-block">
                <div class="detail"><strong>✨ Nuevo Servicio Disponible:</strong> Extensiones de Pestañas Premium</div>
                <div class="detail"><strong>👩 Nuevo Personal:</strong> Catalina, especialista en uñas con 5 años de experiencia</div>
                <div class="detail"><strong>⏰ Nuevos Horarios:</strong> Ahora abierto sábados de 9 AM a 5 PM</div>
              </div>
              <p>¡Reserva con Catalina ahora mismo y disfruta de un 10% de descuento en tu primera cita!</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Ver Disponibilidad</a>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador
            </div>
          </div>
        </body>
        </html>
      `,
    },

    promotion: {
      subject: "🎉 Oferta Especial: 20% Descuento en Combos - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Oferta Especial</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Oferta Especial Para Ti!</h1>
              <p>Descuentos exclusivos esta semana</p>
            </div>
            <div class="content">
              <p>Hola <strong>María</strong>,</p>
              <p>Tenemos una promoción especial solo para ti esta semana:</p>
              <div class="info-block">
                <div class="detail"><strong>💰 Descuento:</strong> 20% en todos nuestros paquetes combo</div>
                <div class="detail"><strong>📦 Paquetes Incluidos:</strong></div>
                <div style="margin-left: 20px; margin-top: 10px; font-size: 14px;">
                  • Luma Queen: $28 → $22.40<br>
                  • Iconic Nails: $18.99 → $15.19<br>
                  • Glam Reset: $18 → $14.40
                </div>
                <div class="detail"><strong>⏰ Válido hasta:</strong> 21 de febrero, 2026</div>
              </div>
              <p>¡No te pierdas esta oportunidad! Reserva ahora mismo.</p>
              <a href="https://luma-git-admin.vercel.app" class="button">Ver Ofertas</a>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador
            </div>
          </div>
        </body>
        </html>
      `,
    },

    password_reset: {
      subject: "🔐 Restablece tu contraseña - Luma Beauty Studio",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecimiento de Contraseña</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Restablece Tu Contraseña</h1>
              <p>Solicitaste un cambio de contraseña</p>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
              <div class="info-block">
                <p style="text-align: center; margin: 20px 0;">
                  <a href="https://luma-git-admin.vercel.app/reset-password?token=abc123xyz" class="button">Restablecer Contraseña</a>
                </p>
                <p style="font-size: 12px; color: #8B7862;">Este enlace expira en 1 hora</p>
              </div>
              <p>Si no solicitaste esto, por favor contacta con nosotros de inmediato.</p>
            </div>
            <div class="footer">
              Luma Beauty Studio | Quito, Ecuador<br>
              <a href="mailto:danielreinosojaya@gmail.com">Soporte</a>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[type];
}

async function main() {
  console.log("\n📧 === GENERADOR DE MUESTRAS DE CORREO LUMA BEAUTY STUDIO ===\n");

  try {
    // Crear directorio para muestras
    const outputDir = path.join(process.cwd(), "email-samples");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✅ Directorio creado: ${outputDir}\n`);
    }

    const notificationTypes: NotificationType[] = [
      "appointment_confirmed",
      "appointment_reminder",
      "appointment_cancelled",
      "appointment_rescheduled",
      "staff_update",
      "promotion",
      "password_reset",
    ];

    console.log("📧 Generando muestras de correo...\n");
    console.log("=" + "=".repeat(79));

    const results: Array<{ type: NotificationType; file: string; error?: string }> = [];

    for (const notificationType of notificationTypes) {
      try {
        const template = getEmailTemplate(notificationType);
        const fileName = `${notificationType}.html`;
        const filePath = path.join(outputDir, fileName);

        fs.writeFileSync(filePath, template.html, "utf-8");

        console.log(`✅ ${notificationLabels[notificationType]}`);
        console.log(`   📄 Archivo: email-samples/${fileName}`);
        console.log(`   📧 Asunto: ${template.subject}`);
        console.log();

        results.push({
          type: notificationType,
          file: filePath,
        });
      } catch (error) {
        console.error(`❌ ${notificationLabels[notificationType]}`);
        console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
        console.log();

        results.push({
          type: notificationType,
          file: "",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.log("=" + "=".repeat(79));
    console.log("\n✨ Generación completada!\n");

    const successful = results.filter((r) => !r.error).length;
    const failed = results.filter((r) => r.error).length;

    console.log(`📊 Resultados:`);
    console.log(`   ✅ Exitosos: ${successful}/${notificationTypes.length}`);
    if (failed > 0) console.log(`   ❌ Errores: ${failed}/${notificationTypes.length}`);

    console.log(`\n📂 Directorio: ${outputDir}\n`);
    console.log("📌 Cómo usar los archivos:\n");
    console.log("   1. Navega a: email-samples/");
    console.log("   2. Abre en navegador: open email-samples/appointment_confirmed.html");
    console.log("   3. O abre VS Code: code email-samples/\n");
    console.log("✨ Todos los archivos HTML están listos para revisar visualmente.\n");
  } catch (error) {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  }
}

// Ejecutar
main();
