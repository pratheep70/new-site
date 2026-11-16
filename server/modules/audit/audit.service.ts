import { desc } from 'drizzle-orm';
import { db } from '../../../src/db/index.ts';
import { auditLogs } from '../../../src/db/schema.ts';

export async function recordAuditLog(params: {
  actorUid?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  try {
    await db.insert(auditLogs).values({
      actorUid: params.actorUid ?? null,
      actorEmail: params.actorEmail ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? null,
      ipAddress: params.ipAddress ?? null,
    });
  } catch (error) {
    console.error('Audit log write failed:', error);
  }
}

export async function listAuditLogs(limit = 50) {
  try {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(Math.min(Math.max(limit, 1), 200));
  } catch (error) {
    console.error('Failed to query audit logs:', error);
    throw new Error('Failed to load audit logs.', { cause: error });
  }
}
