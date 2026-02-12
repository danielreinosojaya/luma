import { db } from "@/lib/db";

export interface AuditLogParams {
  userId: string;
  staffId?: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
}

export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId,
        staffId: params.staffId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        changes: params.changes ? JSON.stringify(params.changes) : null,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}

/**
 * Prevención contra race conditions:
 * Usa SELECT FOR UPDATE en transacciones críticas
 */
export async function withDistributedLock<T>(
  lockKey: string,
  fn: () => Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  // En producción, usar Redis lock. Por ahora, ejecutar directamente
  // TODO: Implementar Redis LOCK cuando Upstash esté configurado
  return fn();
}
