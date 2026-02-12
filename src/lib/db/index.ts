import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let db: any;

if (globalForPrisma.prisma) {
  db = globalForPrisma.prisma;
} else {
  // Crear PrismaClient con configuración apropiada
  db = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Acelerate para edge environments
    ...(process.env.PRISMA_ACCELERATE_URL && {
      accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
    }),
  } as any);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
  }
}

export { db };
export type { PrismaClient } from "@/generated/prisma";
