import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  const runtimeLogs =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Configure it in your deployment environment."
    );
  }

  // Prisma Accelerate
  if (databaseUrl?.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
      log: runtimeLogs as any,
    });
  }

  // Direct PostgreSQL via Driver Adapter
  if (
    databaseUrl.startsWith("postgresql://") ||
    databaseUrl.startsWith("postgres://")
  ) {
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: runtimeLogs as any,
    });
  }

  return new PrismaClient({
    accelerateUrl: databaseUrl,
    log: runtimeLogs as any,
  } as any);
}

let prismaClient: PrismaClient | undefined = globalForPrisma.prisma;

function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = createPrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaClient;
    }
  }

  return prismaClient;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient() as unknown as Record<PropertyKey, unknown>;
    const value = Reflect.get(client, property, receiver);

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});

export type { PrismaClient } from "@/generated/prisma";
