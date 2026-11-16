import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('STAFF'), // 'ADMIN' | 'STAFF'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  subcategories: jsonb('subcategories').$type<
    Array<{ title: string; description: string; items: string[] }>
  >().notNull(),
  audience: jsonb('audience').$type<string[]>().notNull(),
  howWeHelp: jsonb('how_we_help').$type<string[]>().notNull(),
  disclaimer: text('disclaimer').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  serviceSlug: text('service_slug').notNull().default('general'),
  category: text('category').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  referenceCode: text('reference_code').notNull().unique(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  companyName: text('company_name'),
  serviceSlug: text('service_slug').notNull(),
  serviceTitle: text('service_title').notNull(),
  message: text('message').notNull(),
  consentAccepted: boolean('consent_accepted').notNull().default(false),
  status: text('status').notNull().default('NEW'), // NEW | IN_REVIEW | CONTACTED | QUOTED | CLOSED
  internalNotes: text('internal_notes'),
  assignedToUid: text('assigned_to_uid'),
  sourcePage: text('source_page'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const enquiryStatusHistory = pgTable('enquiry_status_history', {
  id: serial('id').primaryKey(),
  enquiryId: integer('enquiry_id')
    .references(() => enquiries.id, { onDelete: 'cascade' })
    .notNull(),
  fromStatus: text('from_status'),
  toStatus: text('to_status').notNull(),
  note: text('note'),
  changedByUid: text('changed_by_uid'),
  changedByEmail: text('changed_by_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationLogs = pgTable('notification_logs', {
  id: serial('id').primaryKey(),
  enquiryId: integer('enquiry_id').references(() => enquiries.id, {
    onDelete: 'cascade',
  }),
  channel: text('channel').notNull().default('EMAIL'),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull(), // SENT | SKIPPED_NOT_CONFIGURED | FAILED
  detail: text('detail'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUid: text('actor_uid'),
  actorEmail: text('actor_email'),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const enquiriesRelations = relations(enquiries, ({ many }) => ({
  statusHistory: many(enquiryStatusHistory),
  notifications: many(notificationLogs),
}));

export const enquiryStatusHistoryRelations = relations(
  enquiryStatusHistory,
  ({ one }) => ({
    enquiry: one(enquiries, {
      fields: [enquiryStatusHistory.enquiryId],
      references: [enquiries.id],
    }),
  }),
);

export const notificationLogsRelations = relations(
  notificationLogs,
  ({ one }) => ({
    enquiry: one(enquiries, {
      fields: [notificationLogs.enquiryId],
      references: [enquiries.id],
    }),
  }),
);
