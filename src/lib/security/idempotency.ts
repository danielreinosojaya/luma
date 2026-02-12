import { db } from "@/lib/db";

/**
 * Idempotency control: ensures duplicate requests return cached response
 * instead of creating duplicate database records
 */
export async function getIdempotencyResponse(
  idempotencyKey: string
): Promise<any | null> {
  try {
    const cached = await db.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });

    if (cached) {
      // Check if still valid
      if (new Date(cached.expiresAt) > new Date()) {
        return JSON.parse(cached.result);
      } else {
        // Expired, delete it
        await db.idempotencyKey.delete({ where: { key: idempotencyKey } });
      }
    }

    return null;
  } catch (error) {
    console.error("Idempotency check failed:", error);
    return null;
  }
}

export async function cacheIdempotencyResponse(
  idempotencyKey: string,
  result: any,
  ttlHours: number = 24
): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);

    await db.idempotencyKey.upsert({
      where: { key: idempotencyKey },
      update: {
        result: JSON.stringify(result),
        expiresAt,
      },
      create: {
        key: idempotencyKey,
        result: JSON.stringify(result),
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Idempotency cache failed:", error);
  }
}

export async function cleanupExpiredIdempotencyKeys(): Promise<void> {
  try {
    const deleted = await db.idempotencyKey.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    console.log(`Cleaned up ${deleted.count} expired idempotency keys`);
  } catch (error) {
    console.error("Idempotency cleanup failed:", error);
  }
}
