import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  // Si la URL es de Accelerate (prisma+postgres://), extraer el api_key
  if (databaseUrl?.startsWith("prisma+postgres://")) {
    const url = new URL(databaseUrl);
    const accelerateUrl = `https://${url.hostname}/?api_key=${url.searchParams.get("api_key")}`;

    return new PrismaClient({
      accelerateUrl,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  // Fallback con `as any` para otras configuraciones
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as any);
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export type { PrismaClient } from "@/generated/prisma";
