import { PrismaClient } from "@/generated/prisma/client";
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

  // PostgreSQL via Driver Adapter with production-safe pool config
  const pool = new Pool({
    connectionString: databaseUrl,
    // Production pool limits
    max: parseInt(process.env.DB_POOL_MAX || "20", 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    // Keep-alive to prevent idle connection drops behind load balancers
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  // Graceful pool error handling (prevents unhandled rejections)
  pool.on("error", (err) => {
    console.error("Unexpected PG pool error:", err);
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: runtimeLogs as any,
  });
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

export type { PrismaClient } from "@/generated/prisma/client";
