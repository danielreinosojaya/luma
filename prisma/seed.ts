import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está configurada");
}

// Crear pool de conexión PostgreSQL directo
const pool = new Pool({
  connectionString: databaseUrl,
});

// Usar el adapter PostgreSQL de Prisma
const adapter = new PrismaPg(pool);

// Crear cliente Prisma con el adapter
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // ============= SERVICES =============
  console.log("📝 Creando servicios...");

  const services = await Promise.all([
    // HAIR Services
    db.service.upsert({
      where: { id: "hair-blowglow" },
      update: {},
      create: {
        id: "hair-blowglow",
        name: "Blow & Glow",
        description: "Cepillado + cejas (diseño y pigmentación)",
        category: "HAIR",
        durationMin: 60,
        price: 15.99,
        active: true,
      },
    }),
    db.service.upsert({
      where: { id: "hair-antessalir" },
      update: {},
      create: {
        id: "hair-antessalir",
        name: "Antes de Salir",
        description: "Cepillado + mani/pedi básico",
        category: "HAIR",
        durationMin: 90,
        price: 22,
        active: true,
      },
    }),
    db.service.upsert({
      where: { id: "hair-lumaqueen" },
      update: {},
      create: {
        id: "hair-lumaqueen",
        name: "Luma Queen",
        description: "Cepillado + mani/pedi shellac",
        category: "HAIR",
        durationMin: 120,
        price: 28,
        active: true,
      },
    }),

    // NAILS Services
    db.service.upsert({
      where: { id: "nails-glamreset" },
      update: {},
      create: {
        id: "nails-glamreset",
        name: "Glam Reset",
        description: "Manicure + pedi básico + cejas (diseño y pigmentación)",
        category: "NAILS",
        durationMin: 90,
        price: 18,
        active: true,
      },
    }),
    db.service.upsert({
      where: { id: "nails-iconic" },
      update: {},
      create: {
        id: "nails-iconic",
        name: "Iconic Nails",
        description: "Manicure + pedi shellac",
        category: "NAILS",
        durationMin: 90,
        price: 18.99,
        active: true,
      },
    }),
    db.service.upsert({
      where: { id: "nails-lumanails" },
      update: {},
      create: {
        id: "nails-lumanails",
        name: "Luma Nails",
        description: "Manicure rubber + pedi clásico",
        category: "NAILS",
        durationMin: 90,
        price: 27.99,
        active: true,
      },
    }),

    // MANICURE Services
    db.service.upsert({
      where: { id: "mani-lumatouch" },
      update: {},
      create: {
        id: "mani-lumatouch",
        name: "Luma Touch",
        description: "Manicure básico + cejas (diseño y pigmentación)",
        category: "MANICURE",
        durationMin: 45,
        price: 10.99,
        active: true,
      },
    }),
    db.service.upsert({
      where: { id: "mani-lumaclasica" },
      update: {},
      create: {
        id: "mani-lumaclasica",
        name: "Luma Clásica",
        description: "Manicure básico + pedi básico",
        category: "MANICURE",
        durationMin: 60,
        price: 12,
        active: true,
      },
    }),
  ]);

  console.log(`✅ ${services.length} servicios creados`);

  // ============= STAFF =============
  console.log("👥 Creando staff...");

  // Create users first
  const staffUsers = await Promise.all([
    db.user.upsert({
      where: { email: "valentina.peluquería@luma.ec" },
      update: {},
      create: {
        email: "valentina.peluquería@luma.ec",
        passwordHash:
          "$2a$12$K2iyT9FZs0DQ3IccSGx.O.0mCOezNeonNgiMjNy3QjlFGgBXcFxKK", // password123
        name: "Valentina",
        role: "STAFF",
        active: true,
      },
    }),
    db.user.upsert({
      where: { email: "catalina.nails@luma.ec" },
      update: {},
      create: {
        email: "catalina.nails@luma.ec",
        passwordHash:
          "$2a$12$K2iyT9FZs0DQ3IccSGx.O.0mCOezNeonNgiMjNy3QjlFGgBXcFxKK", // password123
        name: "Catalina",
        role: "STAFF",
        active: true,
      },
    }),
    db.user.upsert({
      where: { email: "maria.especialista@luma.ec" },
      update: {},
      create: {
        email: "maria.especialista@luma.ec",
        passwordHash:
          "$2a$12$K2iyT9FZs0DQ3IccSGx.O.0mCOezNeonNgiMjNy3QjlFGgBXcFxKK", // password123
        name: "María",
        role: "STAFF",
        active: true,
      },
    }),
  ]);

  // Create staff profiles with services
  const staff = await Promise.all([
    db.staff.upsert({
      where: { userId: staffUsers[0].id },
      update: {},
      create: {
        userId: staffUsers[0].id,
        role: "Stylist de Cabello",
        commissionRate: 0.25,
        services: {
          create: [
            { serviceId: "hair-blowglow" },
            { serviceId: "hair-antessalir" },
            { serviceId: "hair-lumaqueen" },
          ],
        },
      },
    }),
    db.staff.upsert({
      where: { userId: staffUsers[1].id },
      update: {},
      create: {
        userId: staffUsers[1].id,
        role: "Especialista en Uñas",
        commissionRate: 0.2,
        services: {
          create: [
            { serviceId: "nails-glamreset" },
            { serviceId: "nails-iconic" },
            { serviceId: "nails-lumanails" },
            { serviceId: "mani-lumatouch" },
            { serviceId: "mani-lumaclasica" },
          ],
        },
      },
    }),
    db.staff.upsert({
      where: { userId: staffUsers[2].id },
      update: {},
      create: {
        userId: staffUsers[2].id,
        role: "Especialista Premium",
        commissionRate: 0.3,
        services: {
          create: [
            { serviceId: "hair-blowglow" },
            { serviceId: "nails-iconic" },
            { serviceId: "nails-lumanails" },
            { serviceId: "mani-lumaclasica" },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ ${staff.length} profesionales creados`);

  // ============= COMBOS =============
  console.log("📦 Creando paquetes con descuento...");

  const combos = await Promise.all([
    db.combo.upsert({
      where: { id: "combo-clasica" },
      update: {},
      create: {
        id: "combo-clasica",
        name: "Luma Clásica",
        description: "Manicure básico + pedi básico - Perfecta para empezar",
        price: 10,
        discountPct: 17,
        active: true,
        services: {
          create: [{ serviceId: "mani-lumaclasica" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-iconic" },
      update: {},
      create: {
        id: "combo-iconic",
        name: "Iconic Nails",
        description: "Manicure + pedi shellac - Durabilidad premium",
        price: 16.99,
        discountPct: 10,
        active: true,
        services: {
          create: [{ serviceId: "nails-iconic" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-antessalir" },
      update: {},
      create: {
        id: "combo-antessalir",
        name: "Antes de Salir",
        description: "Cepillado + mani/pedi básico - Listas en minutos",
        price: 19.99,
        discountPct: 9,
        active: true,
        services: {
          create: [{ serviceId: "hair-antessalir" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-lumanails" },
      update: {},
      create: {
        id: "combo-lumanails",
        name: "Luma Nails",
        description:
          "Manicure rubber + pedi clásico - Larga duración garantizada",
        price: 24.99,
        discountPct: 10,
        active: true,
        services: {
          create: [{ serviceId: "nails-lumanails" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-queen" },
      update: {},
      create: {
        id: "combo-queen",
        name: "Luma Queen",
        description: "Cepillado + mani/pedi shellac - Lujo total",
        price: 25.99,
        discountPct: 7,
        active: true,
        services: {
          create: [{ serviceId: "hair-lumaqueen" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-blowglow" },
      update: {},
      create: {
        id: "combo-blowglow",
        name: "Blow & Glow",
        description:
          "Cepillado + cejas (diseño y pigmentación) - Brillo inmediato",
        price: 13.99,
        discountPct: 12,
        active: true,
        services: {
          create: [{ serviceId: "hair-blowglow" }],
        },
      },
    }),
    db.combo.upsert({
      where: { id: "combo-glamreset" },
      update: {},
      create: {
        id: "combo-glamreset",
        name: "Glam Reset",
        description:
          "Manicure + pedi básico + cejas (diseño y pigmentación) - Renovación completa",
        price: 15.99,
        discountPct: 11,
        active: true,
        services: {
          create: [{ serviceId: "nails-glamreset" }],
        },
      },
    }),
  ]);

  console.log(`✅ ${combos.length} paquetes creados`);

  // ============= SCHEDULES =============
  console.log("📅 Creando horarios para profesionales...");

  // Schedule: Lunes a Viernes 9:00-18:00, Sábado 10:00-16:00
  const schedules = [];
  for (const s of staff) {
    // Lunes a Viernes
    for (let day = 1; day <= 5; day++) {
      schedules.push(
        db.schedule.upsert({
          where: {
            staffId_dayOfWeek: { staffId: s.id, dayOfWeek: day },
          },
          update: {},
          create: {
            staffId: s.id,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "18:00",
            isAvailable: true,
          },
        })
      );
    }
    // Sábado
    schedules.push(
      db.schedule.upsert({
        where: {
          staffId_dayOfWeek: { staffId: s.id, dayOfWeek: 6 },
        },
        update: {},
        create: {
          staffId: s.id,
          dayOfWeek: 6,
          startTime: "10:00",
          endTime: "16:00",
          isAvailable: true,
        },
      })
    );
    // Domingo - cerrado
    schedules.push(
      db.schedule.upsert({
        where: {
          staffId_dayOfWeek: { staffId: s.id, dayOfWeek: 0 },
        },
        update: {},
        create: {
          staffId: s.id,
          dayOfWeek: 0,
          startTime: "00:00",
          endTime: "00:00",
          isAvailable: false,
        },
      })
    );
  }

  await Promise.all(schedules);
  console.log(`✅ Horarios creados para ${staff.length} profesionales`);

  console.log("🎉 ¡Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
