import crypto from 'node:crypto';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../../../src/db/index.ts';
import {
  enquiries,
  enquiryStatusHistory,
  notificationLogs,
} from '../../../src/db/schema.ts';
import { ENQUIRY_SERVICE_OPTIONS } from '../../../src/data/catalog.ts';
import {
  type EnquiryFormInput,
  type EnquiryStatus,
  generateReferenceCode,
} from '../../../src/utils/validation.ts';
import { sendEnquiryNotification } from '../notifications/notifications.service.ts';
import { recordAuditLog } from '../audit/audit.service.ts';

export async function createEnquiry(
  input: EnquiryFormInput,
  ipAddress?: string | null,
) {
  const serviceOption = ENQUIRY_SERVICE_OPTIONS.find(
    (s) => s.slug === input.serviceSlug,
  );
  const serviceTitle = serviceOption?.title ?? 'General Consultation';
  const referenceCode = generateReferenceCode(
    new Date(),
    crypto.randomBytes(3).toString('hex'),
  );

  try {
    const inserted = await db
      .insert(enquiries)
      .values({
        referenceCode,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        companyName: input.companyName ?? null,
        serviceSlug: input.serviceSlug,
        serviceTitle,
        message: input.message,
        consentAccepted: input.consentAccepted,
        status: 'NEW',
        sourcePage: input.sourcePage ?? '/contact',
      })
      .returning();

    const enquiry = inserted[0];

    await db.insert(enquiryStatusHistory).values({
      enquiryId: enquiry.id,
      fromStatus: null,
      toStatus: 'NEW',
      note: 'Enquiry submitted via website consultation form.',
      changedByUid: null,
      changedByEmail: input.email,
    });

    const notificationResult = await sendEnquiryNotification({
      enquiryId: enquiry.id,
      referenceCode: enquiry.referenceCode,
      fullName: enquiry.fullName,
      serviceTitle: enquiry.serviceTitle,
      sourcePage: enquiry.sourcePage,
    });

    await recordAuditLog({
      actorUid: null,
      actorEmail: null,
      action: 'ENQUIRY_CREATED',
      entityType: 'enquiry',
      entityId: String(enquiry.id),
      metadata: {
        referenceCode: enquiry.referenceCode,
        serviceSlug: enquiry.serviceSlug,
        notificationStatus: notificationResult.status,
      },
      ipAddress: ipAddress ?? null,
    });

    return {
      id: enquiry.id,
      referenceCode: enquiry.referenceCode,
      serviceTitle: enquiry.serviceTitle,
      status: enquiry.status,
      createdAt: enquiry.createdAt,
      notificationStatus: notificationResult.status,
    };
  } catch (error) {
    console.error('Failed to persist enquiry:', error);
    throw new Error('Unable to save your enquiry right now. Please try again or call us directly.', {
      cause: error,
    });
  }
}

export async function listEnquiriesAdmin(params: {
  search?: string;
  status?: string;
  serviceSlug?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const filters = [];
  if (params.status && params.status !== 'ALL') {
    filters.push(eq(enquiries.status, params.status));
  }
  if (params.serviceSlug && params.serviceSlug !== 'ALL') {
    filters.push(eq(enquiries.serviceSlug, params.serviceSlug));
  }
  if (params.search && params.search.trim().length > 0) {
    const pattern = `%${params.search.trim()}%`;
    filters.push(
      or(
        ilike(enquiries.fullName, pattern),
        ilike(enquiries.email, pattern),
        ilike(enquiries.phone, pattern),
        ilike(enquiries.referenceCode, pattern),
        ilike(enquiries.companyName, pattern),
      ),
    );
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  try {
    const [items, countRows, statusCounts] = await Promise.all([
      db
        .select()
        .from(enquiries)
        .where(whereClause)
        .orderBy(desc(enquiries.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(enquiries)
        .where(whereClause),
      db
        .select({
          status: enquiries.status,
          count: sql<number>`count(*)::int`,
        })
        .from(enquiries)
        .groupBy(enquiries.status),
    ]);

    return {
      items,
      total: countRows[0]?.count ?? 0,
      page,
      limit,
      statusCounts: statusCounts.reduce<Record<string, number>>((acc, row) => {
        acc[row.status] = row.count;
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error('Failed to list enquiries:', error);
    throw new Error('Failed to load enquiries.', { cause: error });
  }
}

export async function getEnquiryDetailAdmin(id: number) {
  try {
    const rows = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    const enquiry = rows[0];
    if (!enquiry) return null;

    const [statusHistory, notifications] = await Promise.all([
      db
        .select()
        .from(enquiryStatusHistory)
        .where(eq(enquiryStatusHistory.enquiryId, id))
        .orderBy(desc(enquiryStatusHistory.createdAt)),
      db
        .select()
        .from(notificationLogs)
        .where(eq(notificationLogs.enquiryId, id))
        .orderBy(desc(notificationLogs.createdAt)),
    ]);

    return {
      ...enquiry,
      statusHistory,
      notifications,
    };
  } catch (error) {
    console.error('Failed to fetch enquiry detail:', error);
    throw new Error('Failed to load enquiry details.', { cause: error });
  }
}

export async function updateEnquiryStatusAdmin(params: {
  id: number;
  status: EnquiryStatus;
  internalNotes?: string;
  note?: string;
  actorUid: string;
  actorEmail: string;
  ipAddress?: string | null;
}) {
  try {
    const existingRows = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, params.id))
      .limit(1);

    const existing = existingRows[0];
    if (!existing) return null;

    const updatedRows = await db
      .update(enquiries)
      .set({
        status: params.status,
        ...(params.internalNotes !== undefined
          ? { internalNotes: params.internalNotes }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, params.id))
      .returning();

    const updated = updatedRows[0];

    await db.insert(enquiryStatusHistory).values({
      enquiryId: params.id,
      fromStatus: existing.status,
      toStatus: params.status,
      note: params.note || `Status updated from ${existing.status} to ${params.status}.`,
      changedByUid: params.actorUid,
      changedByEmail: params.actorEmail,
    });

    await recordAuditLog({
      actorUid: params.actorUid,
      actorEmail: params.actorEmail,
      action: 'ENQUIRY_STATUS_UPDATED',
      entityType: 'enquiry',
      entityId: String(params.id),
      metadata: {
        referenceCode: existing.referenceCode,
        fromStatus: existing.status,
        toStatus: params.status,
      },
      ipAddress: params.ipAddress ?? null,
    });

    return updated;
  } catch (error) {
    console.error('Failed to update enquiry status:', error);
    throw new Error('Failed to update enquiry status.', { cause: error });
  }
}
