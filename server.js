var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";

// server/modules/config/env.ts
function getAppConfig() {
  const nodeEnv = process.env.NODE_ENV || "development";
  const port = Number(process.env.PORT || 3e3);
  const appUrl = (process.env.APP_URL || `http://localhost:${port}`).replace(/\/+$/, "");
  const rawAdmins = process.env.ADMIN_EMAILS || (nodeEnv === "production" ? "signinofficial446@gmail.com" : "signinofficial446@gmail.com,nanigameing1@gmail.com");
  const adminEmails = rawAdmins.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const smtpHost = (process.env.SMTP_HOST || "").trim();
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").trim();
  const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);
  return {
    nodeEnv,
    port,
    appUrl,
    adminEmails,
    companyNotificationEmail: (process.env.COMPANY_NOTIFICATION_EMAIL || "signinofficial446@gmail.com").trim(),
    smtp: {
      configured: smtpConfigured,
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      user: smtpUser,
      pass: smtpPass,
      from: process.env.SMTP_FROM || "SIGN IN DOCUMENTS CLEARING <no-reply@signin-documents.example>"
    }
  };
}

// src/lib/firebase-admin.ts
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "main-cascade-l3kqt",
  appId: "1:357967153873:web:2aa110d08e9163c0b093f0",
  apiKey: "AIzaSyBFJHoD-ztlcU0Gcc9KI1HzVtihDdefswk",
  authDomain: "main-cascade-l3kqt.firebaseapp.com",
  storageBucket: "main-cascade-l3kqt.firebasestorage.app",
  messagingSenderId: "357967153873",
  measurementId: "",
  oAuthClientId: "357967153873-aj6vsaorkpol2rcrt8h5fdla6iec95me.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// src/lib/firebase-admin.ts
if (!getApps().length) {
  initializeApp({
    projectId: firebase_applet_config_default.projectId
  });
}
var adminAuth = getAuth();

// server/modules/users/users.service.ts
import { eq } from "drizzle-orm";

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogs: () => auditLogs,
  enquiries: () => enquiries,
  enquiriesRelations: () => enquiriesRelations,
  enquiryStatusHistory: () => enquiryStatusHistory,
  enquiryStatusHistoryRelations: () => enquiryStatusHistoryRelations,
  faqs: () => faqs,
  notificationLogs: () => notificationLogs,
  notificationLogsRelations: () => notificationLogsRelations,
  services: () => services,
  users: () => users
});
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("STAFF"),
  // 'ADMIN' | 'STAFF'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  subcategories: jsonb("subcategories").$type().notNull(),
  audience: jsonb("audience").$type().notNull(),
  howWeHelp: jsonb("how_we_help").$type().notNull(),
  disclaimer: text("disclaimer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  serviceSlug: text("service_slug").notNull().default("general"),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  referenceCode: text("reference_code").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  serviceSlug: text("service_slug").notNull(),
  serviceTitle: text("service_title").notNull(),
  message: text("message").notNull(),
  consentAccepted: boolean("consent_accepted").notNull().default(false),
  status: text("status").notNull().default("NEW"),
  // NEW | IN_REVIEW | CONTACTED | QUOTED | CLOSED
  internalNotes: text("internal_notes"),
  assignedToUid: text("assigned_to_uid"),
  sourcePage: text("source_page"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var enquiryStatusHistory = pgTable("enquiry_status_history", {
  id: serial("id").primaryKey(),
  enquiryId: integer("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  note: text("note"),
  changedByUid: text("changed_by_uid"),
  changedByEmail: text("changed_by_email"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  enquiryId: integer("enquiry_id").references(() => enquiries.id, {
    onDelete: "cascade"
  }),
  channel: text("channel").notNull().default("EMAIL"),
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull(),
  // SENT | SKIPPED_NOT_CONFIGURED | FAILED
  detail: text("detail"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorUid: text("actor_uid"),
  actorEmail: text("actor_email"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: jsonb("metadata").$type(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var enquiriesRelations = relations(enquiries, ({ many }) => ({
  statusHistory: many(enquiryStatusHistory),
  notifications: many(notificationLogs)
}));
var enquiryStatusHistoryRelations = relations(
  enquiryStatusHistory,
  ({ one }) => ({
    enquiry: one(enquiries, {
      fields: [enquiryStatusHistory.enquiryId],
      references: [enquiries.id]
    })
  })
);
var notificationLogsRelations = relations(
  notificationLogs,
  ({ one }) => ({
    enquiry: one(enquiries, {
      fields: [notificationLogs.enquiryId],
      references: [enquiries.id]
    })
  })
);

// src/db/index.ts
var createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15e3
    });
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db = drizzle(pool, { schema: schema_exports });

// server/modules/users/users.service.ts
async function getOrCreateUser(uid, email, displayName) {
  const normalizedEmail = email.trim().toLowerCase();
  const config = getAppConfig();
  const isAllowlistedAdmin = config.adminEmails.includes(normalizedEmail);
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    const resolvedRole = existing[0] ? existing[0].role === "ADMIN" || isAllowlistedAdmin ? "ADMIN" : existing[0].role : isAllowlistedAdmin ? "ADMIN" : "STAFF";
    const result = await db.insert(users).values({
      uid,
      email: normalizedEmail,
      displayName: displayName || null,
      role: resolvedRole,
      isActive: true
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email: normalizedEmail,
        displayName: displayName || null,
        role: resolvedRole,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Database error synchronizing user:", error);
    throw new Error("Unable to verify user profile.", { cause: error });
  }
}

// server/modules/auth/auth.middleware.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is required."
    });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is empty."
    });
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    const dbUser = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || "",
      typeof decodedToken.name === "string" ? decodedToken.name : null
    );
    if (!dbUser.isActive) {
      return res.status(403).json({
        error: "Forbidden",
        message: "This account is inactive."
      });
    }
    req.dbUser = dbUser;
    return next();
  } catch (error) {
    console.error("Auth verification failed:", error);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired authentication token."
    });
  }
};
var requireAdmin = (req, res, next) => {
  if (!req.dbUser) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication is required."
    });
  }
  if (req.dbUser.role !== "ADMIN") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Administrator privileges are required to access this resource. Contact the company administrator to authorize your account."
    });
  }
  return next();
};

// server/modules/services/services.service.ts
import { asc, eq as eq2 } from "drizzle-orm";

// src/data/catalog.ts
var SERVICE_CATALOG = [
  {
    slug: "visa-services",
    title: "Visa Services",
    shortDescription: "Employment, investor and partner, family and dependant, and freelance visa applications, renewals, cancellations, and status changes.",
    fullDescription: "Sign In Documents Clearing coordinates UAE visa paperwork across every stage\u2014from initial document checks and entry permits to status changes, medical testing, Emirates ID coordination, renewals, and cancellations. We help companies, investors, families, and independent professionals navigate administrative steps clearly and accurately.",
    subcategories: [
      {
        title: "Employment Visas",
        description: "Work visa coordination for company staff and new hires in Abu Dhabi and across the UAE.",
        items: ["New employment visa applications", "Visa renewals and amendments", "Employment visa cancellations"]
      },
      {
        title: "Investor & Partner Visas",
        description: "Residency application coordination for company shareholders, founders, and partners.",
        items: ["New investor or partner visa preparation", "Status change and residency stamping steps", "Ongoing renewal reminders"]
      },
      {
        title: "Family & Dependant Visas",
        description: "Guided sponsorship paperwork for spouses, children, and eligible dependants.",
        items: ["Family sponsorship file preparation", "Dependant visa renewals", "Cancellations and status updates"]
      },
      {
        title: "Freelance Visas & All Stages",
        description: "Support for independent professionals alongside full lifecycle visa stage coordination.",
        items: ["Freelance visa application preparation", "In-country status changes", "Medical examination & Emirates ID process coordination"]
      }
    ],
    audience: ["Companies & SMEs", "Investors & Partners", "Families & Dependants", "Freelancers & Professionals"],
    howWeHelp: [
      "Review your visa category and prepare a clear checklist of documents needed for your specific case.",
      "Check application details carefully before submission to minimize avoidable administrative delays.",
      "Coordinate medical fitness appointment scheduling, Emirates ID steps, and status changes.",
      "Provide regular status updates through one dedicated point of contact."
    ],
    disclaimer: "Visa eligibility, required supporting documents, government fees, and final approval decisions or timelines are determined strictly by the relevant UAE immigration and labour authorities.",
    sortOrder: 1
  },
  {
    slug: "pro-services",
    title: "PRO Services",
    shortDescription: "Labour, immigration, and government transactions with ongoing PRO support, expiry tracking, renewal reminders, and one point of contact.",
    fullDescription: "Our Public Relations Officer (PRO) services help Abu Dhabi businesses stay organized across labour, immigration, and licensing transactions. Instead of assigning internal staff to manage fragmented service-centre visits, your company works with one dedicated point of contact who tracks expiries and provides regular status updates.",
    subcategories: [
      {
        title: "Labour Transactions",
        description: "Day-to-day coordination for workforce paperwork and labour authority submissions.",
        items: ["Work permits", "Labour contracts", "Labour card renewals and cancellations"]
      },
      {
        title: "Immigration Transactions",
        description: "Structured processing for residency and entry administration.",
        items: ["Entry permits", "Residence visa processing", "Status changes and residency updates"]
      },
      {
        title: "Government Transactions",
        description: "Coordination and follow-up across relevant Abu Dhabi and UAE departments.",
        items: ["Trade licence renewals and approvals", "Departmental clearances", "Service-centre follow-up"]
      },
      {
        title: "Ongoing PRO Support",
        description: "Reliable continuity for growing teams and established UAE entities.",
        items: ["Expiry tracking and renewal reminders", "One point of contact for your company file", "Regular, transparent status updates"]
      }
    ],
    audience: ["Companies & SMEs", "Investors & Partners"],
    howWeHelp: [
      "Assign one point of contact familiar with your company\u2019s active files and renewal schedule.",
      "Track upcoming labour, visa, and licence expiries and send timely renewal reminders.",
      "Prepare applications, coordinate service-centre follow-up, and keep your management team informed."
    ],
    disclaimer: "All government approvals, official charges, and processing durations depend on the specific transaction and the policies of the relevant UAE authority.",
    sortOrder: 2
  },
  {
    slug: "document-clearing",
    title: "Document Clearing",
    shortDescription: "Certified legal translation, ministry and embassy attestation, and end-to-end collection and return for educational, commercial, personal, and legal documents.",
    fullDescription: "Cross-border personal and corporate matters often require documents to be translated, verified, and attested in a specific sequence. Sign In Documents Clearing manages end-to-end collection, certified legal translation, ministry and embassy attestation coordination, and secure return of your cleared documents.",
    subcategories: [
      {
        title: "Educational Documents",
        description: "Clearing and attestation coordination for academic records required for employment or residency.",
        items: ["University degrees and diplomas", "School certificates and transcripts"]
      },
      {
        title: "Commercial Documents",
        description: "Documentation handling for corporate governance, banking, and commercial expansion.",
        items: ["Company formation and trade documents", "Board resolutions and commercial certificates"]
      },
      {
        title: "Personal Documents",
        description: "Attestation and translation coordination for family sponsorship and civil matters.",
        items: ["Marriage certificates", "Birth certificates and personal civil records"]
      },
      {
        title: "Legal, Translation & Attestation",
        description: "End-to-end clearing workflow tailored to the receiving authority\u2019s format requirements.",
        items: ["Contracts and powers of attorney", "Certified legal translation", "Ministry and embassy attestation coordination", "End-to-end collection, attestation, and return"]
      }
    ],
    audience: ["Companies & SMEs", "Investors & Partners", "Families & Dependants", "Freelancers & Professionals"],
    howWeHelp: [
      "Confirm the exact attestation and translation sequence required for your destination authority.",
      "Coordinate collection of original documents, certified legal translation, and ministry/embassy submissions.",
      "Keep you updated at each milestone and arrange return delivery once clearing is complete."
    ],
    disclaimer: "Attestation requirements, applicable stamp duties, and processing timeframes vary by issuing country, document type, and the relevant ministry or embassy.",
    sortOrder: 3
  },
  {
    slug: "business-setup",
    title: "Business Setup",
    shortDescription: "Mainland and free zone company formation, trade licence renewals, and company amendments in Abu Dhabi and across the UAE.",
    fullDescription: "Whether you are launching a new venture in Abu Dhabi or updating an existing corporate structure, Sign In Documents Clearing guides founders and investors through mainland and free zone company formation paperwork, trade licence renewals, and company amendments.",
    subcategories: [
      {
        title: "Company Formation",
        description: "Structured administrative coordination for new UAE business entities.",
        items: ["Mainland company formation support", "Free zone company formation coordination"]
      },
      {
        title: "Licensing & Corporate Amendments",
        description: "Keeping existing licences compliant and updated as your business evolves.",
        items: ["Trade licence renewals", "Company amendments (activities, partners, or licence details)"]
      }
    ],
    audience: ["Investors & Partners", "Companies & SMEs"],
    howWeHelp: [
      "Understand your proposed business activity and preferred jurisdiction (mainland or free zone).",
      "Organize initial name reservation, licence application paperwork, and supporting corporate documents.",
      "Handle annual trade licence renewal coordination and corporate amendment filings."
    ],
    disclaimer: "Licensing eligibility, external departmental approvals, government fees, and formation timelines are set by the applicable economic department or free zone authority.",
    sortOrder: 4
  },
  {
    slug: "insurance",
    title: "Insurance",
    shortDescription: "Coordination for medical insurance, company insurance, employee insurance, and timely policy renewals.",
    fullDescription: "Health and corporate coverage are essential parts of UAE residency and business compliance. Sign In Documents Clearing assists individuals and companies with coordinating medical, employee, and company insurance applications and renewals alongside your visa and PRO files.",
    subcategories: [
      {
        title: "Medical & Employee Coverage",
        description: "Insurance coordination aligned with residency and workforce requirements.",
        items: ["Individual and family medical insurance coordination", "Employee group medical insurance coordination"]
      },
      {
        title: "Company Policies & Renewals",
        description: "Administrative support to keep business and staff policies active on schedule.",
        items: ["Company insurance coordination", "Annual policy renewal tracking and paperwork"]
      }
    ],
    audience: ["Companies & SMEs", "Investors & Partners", "Families & Dependants", "Freelancers & Professionals"],
    howWeHelp: [
      "Gather accurate applicant or employee details needed to request insurance quotations.",
      "Align medical insurance activation with your visa application or renewal timeline.",
      "Track renewal dates alongside visa and licence expiries for seamless continuity."
    ],
    disclaimer: "Insurance terms, coverage benefits, underwriting eligibility, and premiums are determined solely by licensed insurance providers and applicable UAE regulations.",
    sortOrder: 5
  },
  {
    slug: "emirates-id",
    title: "Emirates ID",
    shortDescription: "New Emirates ID applications, processing coordination, renewals, and lost ID replacement support.",
    fullDescription: "Emirates ID registration is required for UAE residents across personal, banking, and government interactions. We prepare and coordinate new applications, renewals, and lost ID replacements cleanly alongside your residency file.",
    subcategories: [
      {
        title: "Applications & Renewals",
        description: "Accurate form preparation and follow-up for resident identity cards.",
        items: ["New Emirates ID applications", "Emirates ID renewals", "Application status follow-up"]
      },
      {
        title: "Processing & Replacement",
        description: "Support for biometric scheduling coordination and card replacement.",
        items: ["Processing coordination with residency steps", "Lost or damaged Emirates ID replacement applications"]
      }
    ],
    audience: ["Companies & SMEs", "Investors & Partners", "Families & Dependants", "Freelancers & Professionals"],
    howWeHelp: [
      "Prepare accurate Emirates ID application forms linked with your visa status.",
      "Advise on biometric appointment steps and required identification details.",
      "Assist quickly with lost ID replacement filings and renewal tracking."
    ],
    disclaimer: "Emirates ID issuance, biometric scheduling, card printing, and official fees are governed by the Federal Authority for Identity, Citizenship, Customs & Port Security (ICP).",
    sortOrder: 6
  }
];
var FAQ_CATALOG = [
  {
    serviceSlug: "general",
    category: "General & Process",
    question: "What services does Sign In Documents Clearing provide?",
    answer: "Sign In Transactions Follow Up Services LLC (operating as SIGN IN DOCUMENTS CLEARING) provides Visa Services, PRO Services, Document Clearing (including certified legal translation and attestation), Business Setup, Insurance coordination, and Emirates ID services from our office on Najda Street, Abu Dhabi.",
    sortOrder: 1
  },
  {
    serviceSlug: "general",
    category: "General & Process",
    question: "Do you guarantee visa approvals or fixed processing times?",
    answer: "No. While we carefully review every document and follow up diligently with relevant authorities, all visa approvals, attestations, licences, and processing timelines are determined solely by the competent UAE government authorities or service providers.",
    sortOrder: 2
  },
  {
    serviceSlug: "general",
    category: "General & Process",
    question: "Should I attach passport copies or Emirates ID scans in the online enquiry form?",
    answer: "Please do not upload or include passport numbers, Emirates ID copies, or confidential attachments in the initial website contact form. Share a brief overview of what you need, and our team will advise you on the appropriate and secure way to share documents once your consultation begins.",
    sortOrder: 3
  },
  {
    serviceSlug: "visa-services",
    category: "Visa Services",
    question: "Which types of UAE visas can you help coordinate?",
    answer: "We assist with employment visas, investor and partner visas, family and dependant visas, and freelance visas across new applications, renewals, cancellations, status changes, and medical/Emirates ID coordination.",
    sortOrder: 4
  },
  {
    serviceSlug: "visa-services",
    category: "Visa Services",
    question: "How do I find out the exact documents and fees required for my visa case?",
    answer: "Document checklists, eligibility criteria, and official fees depend on the visa category, sponsor profile, and current authority regulations. Submit a consultation request or call us on 0501022663 so we can review your specific situation and confirm the requirements.",
    sortOrder: 5
  },
  {
    serviceSlug: "pro-services",
    category: "PRO Services",
    question: "How does your ongoing PRO support work for companies in Abu Dhabi?",
    answer: "Your company is assigned one point of contact to coordinate labour, immigration, and government transactions. We also help track visa, labour card, and trade licence expiry dates, provide renewal reminders, and share regular status updates.",
    sortOrder: 6
  },
  {
    serviceSlug: "document-clearing",
    category: "Document Clearing",
    question: "What types of documents can you clear, translate, and attest?",
    answer: "We handle educational documents (degrees and school certificates), commercial documents (company and trade paperwork), personal documents (marriage and birth certificates), and legal documents (contracts and powers of attorney), including certified legal translation and ministry/embassy attestation coordination.",
    sortOrder: 7
  },
  {
    serviceSlug: "business-setup",
    category: "Business Setup",
    question: "Do you assist with both mainland and free zone business setup?",
    answer: "Yes. We support administrative coordination for both mainland and free zone company formation, as well as ongoing trade licence renewals and company amendments. Final licensing requirements and approvals depend on the chosen authority and business activity.",
    sortOrder: 8
  },
  {
    serviceSlug: "insurance",
    category: "Insurance",
    question: "Can you coordinate medical insurance alongside visa applications?",
    answer: "Yes. We coordinate individual medical insurance, employee insurance, company insurance, and policy renewals so your coverage aligns smoothly with your residency or company paperwork, subject to licensed insurer underwriting.",
    sortOrder: 9
  },
  {
    serviceSlug: "emirates-id",
    category: "Emirates ID",
    question: "Can you help if my Emirates ID is lost or due for renewal?",
    answer: "Yes. We assist with new Emirates ID applications, renewals, processing coordination, and lost ID replacement applications. Biometrics and final card issuance remain managed by the relevant UAE identity authority.",
    sortOrder: 10
  }
];
var ENQUIRY_SERVICE_OPTIONS = [
  ...SERVICE_CATALOG.map((s) => ({ slug: s.slug, title: s.title })),
  { slug: "general-consultation", title: "General Consultation" }
];

// server/modules/services/services.service.ts
var catalogSeeded = false;
var seedingInFlight = null;
async function ensureCatalogSeeded() {
  if (catalogSeeded) return;
  if (seedingInFlight) return seedingInFlight;
  seedingInFlight = (async () => {
    try {
      const existingServices = await db.select({ id: services.id }).from(services).limit(1);
      if (existingServices.length === 0) {
        for (const item of SERVICE_CATALOG) {
          await db.insert(services).values({
            slug: item.slug,
            title: item.title,
            shortDescription: item.shortDescription,
            fullDescription: item.fullDescription,
            subcategories: item.subcategories,
            audience: item.audience,
            howWeHelp: item.howWeHelp,
            disclaimer: item.disclaimer,
            sortOrder: item.sortOrder,
            isPublished: true
          }).onConflictDoNothing({ target: services.slug });
        }
      }
      const existingFaqs = await db.select({ id: faqs.id }).from(faqs).limit(1);
      if (existingFaqs.length === 0) {
        await db.insert(faqs).values(
          FAQ_CATALOG.map((faq) => ({
            serviceSlug: faq.serviceSlug,
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
            sortOrder: faq.sortOrder,
            isPublished: true
          }))
        );
      }
      catalogSeeded = true;
    } catch (error) {
      console.error("Catalog seed error:", error);
      throw new Error("Failed to initialize service catalog.", { cause: error });
    } finally {
      seedingInFlight = null;
    }
  })();
  return seedingInFlight;
}
async function listPublishedServices() {
  await ensureCatalogSeeded();
  try {
    return await db.select().from(services).where(eq2(services.isPublished, true)).orderBy(asc(services.sortOrder));
  } catch (error) {
    console.error("Failed to list services:", error);
    throw new Error("Failed to load services.", { cause: error });
  }
}
async function getPublishedServiceBySlug(slug) {
  await ensureCatalogSeeded();
  try {
    const rows = await db.select().from(services).where(eq2(services.slug, slug)).limit(1);
    const svc = rows[0];
    if (!svc || !svc.isPublished) {
      return null;
    }
    const serviceFaqs = await db.select().from(faqs).where(eq2(faqs.serviceSlug, slug)).orderBy(asc(faqs.sortOrder));
    return {
      ...svc,
      faqs: serviceFaqs.filter((f) => f.isPublished)
    };
  } catch (error) {
    console.error("Failed to get service detail:", error);
    throw new Error("Failed to load service details.", { cause: error });
  }
}
async function listPublishedFaqs(serviceSlug) {
  await ensureCatalogSeeded();
  try {
    const all = await db.select().from(faqs).where(eq2(faqs.isPublished, true)).orderBy(asc(faqs.sortOrder));
    if (!serviceSlug || serviceSlug === "all") {
      return all;
    }
    return all.filter((f) => f.serviceSlug === serviceSlug);
  } catch (error) {
    console.error("Failed to list FAQs:", error);
    throw new Error("Failed to load FAQs.", { cause: error });
  }
}
async function listAllServicesAdmin() {
  await ensureCatalogSeeded();
  try {
    return await db.select().from(services).orderBy(asc(services.sortOrder));
  } catch (error) {
    console.error("Admin failed to list services:", error);
    throw new Error("Failed to load services.", { cause: error });
  }
}
async function updateServiceAdmin(slug, patch) {
  await ensureCatalogSeeded();
  try {
    const updated = await db.update(services).set({
      ...patch.shortDescription !== void 0 ? { shortDescription: patch.shortDescription } : {},
      ...patch.fullDescription !== void 0 ? { fullDescription: patch.fullDescription } : {},
      ...patch.disclaimer !== void 0 ? { disclaimer: patch.disclaimer } : {},
      ...patch.isPublished !== void 0 ? { isPublished: patch.isPublished } : {},
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(services.slug, slug)).returning();
    return updated[0] || null;
  } catch (error) {
    console.error("Failed to update service:", error);
    throw new Error("Failed to update service.", { cause: error });
  }
}
async function listAllFaqsAdmin() {
  await ensureCatalogSeeded();
  try {
    return await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  } catch (error) {
    console.error("Admin failed to list FAQs:", error);
    throw new Error("Failed to load FAQs.", { cause: error });
  }
}
async function createFaqAdmin(input) {
  await ensureCatalogSeeded();
  try {
    const created = await db.insert(faqs).values({
      serviceSlug: input.serviceSlug,
      category: input.category,
      question: input.question,
      answer: input.answer,
      sortOrder: input.sortOrder ?? 99,
      isPublished: input.isPublished ?? true
    }).returning();
    return created[0];
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    throw new Error("Failed to create FAQ.", { cause: error });
  }
}
async function updateFaqAdmin(id, input) {
  try {
    const updated = await db.update(faqs).set({
      ...input.category !== void 0 ? { category: input.category } : {},
      ...input.question !== void 0 ? { question: input.question } : {},
      ...input.answer !== void 0 ? { answer: input.answer } : {},
      ...input.isPublished !== void 0 ? { isPublished: input.isPublished } : {},
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq2(faqs.id, id)).returning();
    return updated[0] || null;
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    throw new Error("Failed to update FAQ.", { cause: error });
  }
}
async function deleteFaqAdmin(id) {
  try {
    const deleted = await db.delete(faqs).where(eq2(faqs.id, id)).returning();
    return deleted[0] || null;
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    throw new Error("Failed to delete FAQ.", { cause: error });
  }
}

// server/modules/enquiries/enquiries.service.ts
import crypto from "node:crypto";
import { and, desc as desc2, eq as eq3, ilike, or, sql } from "drizzle-orm";

// src/utils/validation.ts
var ENQUIRY_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "QUOTED",
  "CLOSED"
];
function sanitizeText(value, maxLength = 2e3) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
function normalizePhoneDigits(raw) {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  return hasPlus ? `+${digits}` : digits;
}
function isValidPhone(raw) {
  const digitsOnly = raw.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}
function isValidEmail(raw) {
  const email = raw.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
function validateEnquiryInput(input, allowedServiceSlugs) {
  const errors = {};
  const fullName = sanitizeText(input.fullName, 120);
  const phone = normalizePhoneDigits(sanitizeText(input.phone, 30));
  const email = sanitizeText(input.email, 254).toLowerCase();
  const companyName = sanitizeText(input.companyName ?? "", 140);
  const serviceSlug = sanitizeText(input.serviceSlug, 80);
  const message = sanitizeText(input.message, 2e3);
  const consentAccepted = Boolean(input.consentAccepted);
  const sourcePage = sanitizeText(input.sourcePage ?? "", 160);
  if (fullName.length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }
  if (!isValidPhone(phone)) {
    errors.phone = "Please enter a valid UAE or international phone number.";
  }
  if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!serviceSlug || !allowedServiceSlugs.includes(serviceSlug)) {
    errors.serviceSlug = "Please choose a service from the list.";
  }
  if (message.length < 10) {
    errors.message = "Please briefly describe what you need (at least 10 characters).";
  }
  if (!consentAccepted) {
    errors.consentAccepted = "Please confirm that we may contact you regarding this enquiry.";
  }
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    errors: {},
    data: {
      fullName,
      phone,
      email,
      companyName: companyName || void 0,
      serviceSlug,
      message,
      consentAccepted,
      sourcePage: sourcePage || void 0
    }
  };
}
function generateReferenceCode(date = /* @__PURE__ */ new Date(), randomHex) {
  const year = date.getUTCFullYear();
  const suffix = (randomHex ?? Math.floor(1e5 + Math.random() * 9e5).toString()).toUpperCase().slice(0, 6);
  return `SIGN-${year}-${suffix}`;
}

// server/modules/notifications/notifications.service.ts
import nodemailer from "nodemailer";
async function sendEnquiryNotification(params) {
  const config = getAppConfig();
  const recipient = config.companyNotificationEmail;
  const subject = `New Consultation Enquiry (${params.referenceCode}) - ${params.serviceTitle}`;
  if (!config.smtp.configured) {
    try {
      await db.insert(notificationLogs).values({
        enquiryId: params.enquiryId,
        channel: "EMAIL",
        recipient,
        subject,
        status: "SKIPPED_NOT_CONFIGURED",
        detail: "SMTP credentials are not configured. Enquiry is saved in PostgreSQL for admin review."
      });
    } catch (error) {
      console.error("Failed to record skipped notification log:", error);
    }
    return { delivered: false, status: "SKIPPED_NOT_CONFIGURED" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });
    const bodyText = [
      `A new consultation enquiry has been recorded.`,
      ``,
      `Reference: ${params.referenceCode}`,
      `Service: ${params.serviceTitle}`,
      `Client Name: ${params.fullName}`,
      `Source Page: ${params.sourcePage || "/contact"}`,
      ``,
      `Please sign in to the SIGN IN DOCUMENTS CLEARING admin dashboard to review full contact details and update the enquiry status.`
    ].join("\n");
    await transporter.sendMail({
      from: config.smtp.from,
      to: recipient,
      subject,
      text: bodyText
    });
    await db.insert(notificationLogs).values({
      enquiryId: params.enquiryId,
      channel: "EMAIL",
      recipient,
      subject,
      status: "SENT",
      detail: "Email notification dispatched via configured SMTP relay."
    });
    return { delivered: true, status: "SENT" };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message.slice(0, 300) : "SMTP transport error";
    console.error("SMTP notification failed:", error);
    try {
      await db.insert(notificationLogs).values({
        enquiryId: params.enquiryId,
        channel: "EMAIL",
        recipient,
        subject,
        status: "FAILED",
        detail: errMsg
      });
    } catch (logErr) {
      console.error("Failed to log SMTP failure:", logErr);
    }
    return { delivered: false, status: "FAILED" };
  }
}

// server/modules/audit/audit.service.ts
import { desc } from "drizzle-orm";
async function recordAuditLog(params) {
  try {
    await db.insert(auditLogs).values({
      actorUid: params.actorUid ?? null,
      actorEmail: params.actorEmail ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? null,
      ipAddress: params.ipAddress ?? null
    });
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}
async function listAuditLogs(limit = 50) {
  try {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(Math.min(Math.max(limit, 1), 200));
  } catch (error) {
    console.error("Failed to query audit logs:", error);
    throw new Error("Failed to load audit logs.", { cause: error });
  }
}

// server/modules/enquiries/enquiries.service.ts
async function createEnquiry(input, ipAddress) {
  const serviceOption = ENQUIRY_SERVICE_OPTIONS.find(
    (s) => s.slug === input.serviceSlug
  );
  const serviceTitle = serviceOption?.title ?? "General Consultation";
  const referenceCode = generateReferenceCode(
    /* @__PURE__ */ new Date(),
    crypto.randomBytes(3).toString("hex")
  );
  try {
    const inserted = await db.insert(enquiries).values({
      referenceCode,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      companyName: input.companyName ?? null,
      serviceSlug: input.serviceSlug,
      serviceTitle,
      message: input.message,
      consentAccepted: input.consentAccepted,
      status: "NEW",
      sourcePage: input.sourcePage ?? "/contact"
    }).returning();
    const enquiry = inserted[0];
    await db.insert(enquiryStatusHistory).values({
      enquiryId: enquiry.id,
      fromStatus: null,
      toStatus: "NEW",
      note: "Enquiry submitted via website consultation form.",
      changedByUid: null,
      changedByEmail: input.email
    });
    const notificationResult = await sendEnquiryNotification({
      enquiryId: enquiry.id,
      referenceCode: enquiry.referenceCode,
      fullName: enquiry.fullName,
      serviceTitle: enquiry.serviceTitle,
      sourcePage: enquiry.sourcePage
    });
    await recordAuditLog({
      actorUid: null,
      actorEmail: null,
      action: "ENQUIRY_CREATED",
      entityType: "enquiry",
      entityId: String(enquiry.id),
      metadata: {
        referenceCode: enquiry.referenceCode,
        serviceSlug: enquiry.serviceSlug,
        notificationStatus: notificationResult.status
      },
      ipAddress: ipAddress ?? null
    });
    return {
      id: enquiry.id,
      referenceCode: enquiry.referenceCode,
      serviceTitle: enquiry.serviceTitle,
      status: enquiry.status,
      createdAt: enquiry.createdAt,
      notificationStatus: notificationResult.status
    };
  } catch (error) {
    console.error("Failed to persist enquiry:", error);
    throw new Error("Unable to save your enquiry right now. Please try again or call us directly.", {
      cause: error
    });
  }
}
async function listEnquiriesAdmin(params) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;
  const filters = [];
  if (params.status && params.status !== "ALL") {
    filters.push(eq3(enquiries.status, params.status));
  }
  if (params.serviceSlug && params.serviceSlug !== "ALL") {
    filters.push(eq3(enquiries.serviceSlug, params.serviceSlug));
  }
  if (params.search && params.search.trim().length > 0) {
    const pattern = `%${params.search.trim()}%`;
    filters.push(
      or(
        ilike(enquiries.fullName, pattern),
        ilike(enquiries.email, pattern),
        ilike(enquiries.phone, pattern),
        ilike(enquiries.referenceCode, pattern),
        ilike(enquiries.companyName, pattern)
      )
    );
  }
  const whereClause = filters.length > 0 ? and(...filters) : void 0;
  try {
    const [items, countRows, statusCounts] = await Promise.all([
      db.select().from(enquiries).where(whereClause).orderBy(desc2(enquiries.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql`count(*)::int` }).from(enquiries).where(whereClause),
      db.select({
        status: enquiries.status,
        count: sql`count(*)::int`
      }).from(enquiries).groupBy(enquiries.status)
    ]);
    return {
      items,
      total: countRows[0]?.count ?? 0,
      page,
      limit,
      statusCounts: statusCounts.reduce((acc, row) => {
        acc[row.status] = row.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error("Failed to list enquiries:", error);
    throw new Error("Failed to load enquiries.", { cause: error });
  }
}
async function getEnquiryDetailAdmin(id) {
  try {
    const rows = await db.select().from(enquiries).where(eq3(enquiries.id, id)).limit(1);
    const enquiry = rows[0];
    if (!enquiry) return null;
    const [statusHistory, notifications] = await Promise.all([
      db.select().from(enquiryStatusHistory).where(eq3(enquiryStatusHistory.enquiryId, id)).orderBy(desc2(enquiryStatusHistory.createdAt)),
      db.select().from(notificationLogs).where(eq3(notificationLogs.enquiryId, id)).orderBy(desc2(notificationLogs.createdAt))
    ]);
    return {
      ...enquiry,
      statusHistory,
      notifications
    };
  } catch (error) {
    console.error("Failed to fetch enquiry detail:", error);
    throw new Error("Failed to load enquiry details.", { cause: error });
  }
}
async function updateEnquiryStatusAdmin(params) {
  try {
    const existingRows = await db.select().from(enquiries).where(eq3(enquiries.id, params.id)).limit(1);
    const existing = existingRows[0];
    if (!existing) return null;
    const updatedRows = await db.update(enquiries).set({
      status: params.status,
      ...params.internalNotes !== void 0 ? { internalNotes: params.internalNotes } : {},
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(enquiries.id, params.id)).returning();
    const updated = updatedRows[0];
    await db.insert(enquiryStatusHistory).values({
      enquiryId: params.id,
      fromStatus: existing.status,
      toStatus: params.status,
      note: params.note || `Status updated from ${existing.status} to ${params.status}.`,
      changedByUid: params.actorUid,
      changedByEmail: params.actorEmail
    });
    await recordAuditLog({
      actorUid: params.actorUid,
      actorEmail: params.actorEmail,
      action: "ENQUIRY_STATUS_UPDATED",
      entityType: "enquiry",
      entityId: String(params.id),
      metadata: {
        referenceCode: existing.referenceCode,
        fromStatus: existing.status,
        toStatus: params.status
      },
      ipAddress: params.ipAddress ?? null
    });
    return updated;
  } catch (error) {
    console.error("Failed to update enquiry status:", error);
    throw new Error("Failed to update enquiry status.", { cause: error });
  }
}

// server/modules/docs/openapi.ts
function buildOpenApiSpec(baseUrl) {
  return {
    openapi: "3.0.3",
    info: {
      title: "SIGN IN DOCUMENTS CLEARING API",
      version: "1.0.0",
      description: "REST API for Sign In Transactions Follow Up Services LLC (Abu Dhabi, UAE). Covers public service/FAQ retrieval, validated consultation enquiry submission, and role-protected administrative enquiry management."
    },
    servers: [{ url: baseUrl }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase Authentication ID token."
        }
      }
    },
    paths: {
      "/api/v1/health": {
        get: {
          summary: "Service health check",
          responses: { "200": { description: "Application is running" } }
        }
      },
      "/api/v1/services": {
        get: {
          summary: "List published service categories",
          responses: { "200": { description: "Array of service objects" } }
        }
      },
      "/api/v1/services/{slug}": {
        get: {
          summary: "Get service detail and related FAQs by slug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Service detail object" },
            "404": { description: "Service not found" }
          }
        }
      },
      "/api/v1/faqs": {
        get: {
          summary: "List published FAQs",
          parameters: [
            {
              name: "serviceSlug",
              in: "query",
              required: false,
              schema: { type: "string" }
            }
          ],
          responses: { "200": { description: "Array of FAQ items" } }
        }
      },
      "/api/v1/enquiries": {
        post: {
          summary: "Submit a consultation enquiry",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "fullName",
                    "phone",
                    "email",
                    "serviceSlug",
                    "message",
                    "consentAccepted"
                  ],
                  properties: {
                    fullName: { type: "string" },
                    phone: { type: "string" },
                    email: { type: "string", format: "email" },
                    companyName: { type: "string" },
                    serviceSlug: { type: "string" },
                    message: { type: "string" },
                    consentAccepted: { type: "boolean" },
                    sourcePage: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Enquiry recorded in PostgreSQL" },
            "400": { description: "Validation error" },
            "429": { description: "Rate limit exceeded" }
          }
        }
      },
      "/api/v1/auth/me": {
        get: {
          summary: "Get authenticated user profile and role",
          security: [{ BearerAuth: [] }],
          responses: {
            "200": { description: "Current user profile" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/v1/auth/logout": {
        post: {
          summary: "Record administrative logout event",
          security: [{ BearerAuth: [] }],
          responses: { "200": { description: "Logged out" } }
        }
      },
      "/api/v1/admin/enquiries": {
        get: {
          summary: "List enquiries with search, status, and service filters (Admin only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "serviceSlug", in: "query", schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } }
          ],
          responses: {
            "200": { description: "Paginated enquiries list" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
          }
        }
      },
      "/api/v1/admin/enquiries/{id}": {
        get: {
          summary: "Get full enquiry detail including status history and notification logs (Admin only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            "200": { description: "Enquiry detail" },
            "404": { description: "Not found" }
          }
        }
      },
      "/api/v1/admin/enquiries/{id}/status": {
        patch: {
          summary: "Update enquiry status and internal notes (Admin only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["NEW", "IN_REVIEW", "CONTACTED", "QUOTED", "CLOSED"]
                    },
                    internalNotes: { type: "string" },
                    note: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Status updated" },
            "400": { description: "Invalid status" }
          }
        }
      },
      "/api/v1/admin/faqs": {
        get: {
          summary: "List all FAQs including unpublished (Admin only)",
          security: [{ BearerAuth: [] }],
          responses: { "200": { description: "FAQ list" } }
        },
        post: {
          summary: "Create a new FAQ entry (Admin only)",
          security: [{ BearerAuth: [] }],
          responses: { "201": { description: "FAQ created" } }
        }
      },
      "/api/v1/admin/audit-logs": {
        get: {
          summary: "List recent administrative audit logs (Admin only)",
          security: [{ BearerAuth: [] }],
          responses: { "200": { description: "Audit logs" } }
        }
      }
    }
  };
}

// server.ts
async function startServer() {
  const config = getAppConfig();
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
    })
  );
  const extraCorsOrigins = (process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || origin.endsWith(".run.app") || origin === config.appUrl || extraCorsOrigins.includes(origin)) {
          return callback(null, true);
        }
        if (config.nodeEnv !== "production") {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "64kb" }));
  const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "TooManyRequests",
      message: "Too many enquiry submissions from this connection. Please wait a few minutes or call 0501022663."
    }
  });
  const adminLimiter = rateLimit({
    windowMs: 5 * 60 * 1e3,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.get("/api/openapi.json", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.json(buildOpenApiSpec(baseUrl));
  });
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(void 0, {
      swaggerOptions: { url: "/api/openapi.json" },
      customSiteTitle: "SIGN IN DOCUMENTS CLEARING \u2014 API Docs"
    })
  );
  app.get("/robots.txt", (req, res) => {
    const baseUrl = config.appUrl || `${req.protocol}://${req.get("host")}`;
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api/",
        `Sitemap: ${baseUrl}/sitemap.xml`
      ].join("\n")
    );
  });
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = config.appUrl || `${req.protocol}://${req.get("host")}`;
    const staticRoutes = [
      "/",
      "/about",
      "/services",
      "/how-we-work",
      "/faq",
      "/contact",
      "/privacy-policy",
      "/terms-and-conditions",
      ...SERVICE_CATALOG.map((s) => `/services/${s.slug}`)
    ];
    const urls = staticRoutes.map(
      (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    ).join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
    );
  });
  app.get("/api/v1/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "sign-in-documents-clearing",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/v1/services", async (_req, res) => {
    try {
      const items = await listPublishedServices();
      return res.json({ items });
    } catch (error) {
      return res.status(500).json({
        error: "DatabaseError",
        message: error instanceof Error ? error.message : "Unable to load services."
      });
    }
  });
  app.get("/api/v1/services/:slug", async (req, res) => {
    const slug = sanitizeText(req.params.slug, 80);
    try {
      const service = await getPublishedServiceBySlug(slug);
      if (!service) {
        return res.status(404).json({
          error: "NotFound",
          message: "Service not found."
        });
      }
      return res.json({ item: service });
    } catch (error) {
      return res.status(500).json({
        error: "DatabaseError",
        message: error instanceof Error ? error.message : "Unable to load service."
      });
    }
  });
  app.get("/api/v1/faqs", async (req, res) => {
    const serviceSlug = typeof req.query.serviceSlug === "string" ? sanitizeText(req.query.serviceSlug, 80) : void 0;
    try {
      const items = await listPublishedFaqs(serviceSlug);
      return res.json({ items });
    } catch (error) {
      return res.status(500).json({
        error: "DatabaseError",
        message: error instanceof Error ? error.message : "Unable to load FAQs."
      });
    }
  });
  app.post("/api/v1/enquiries", enquiryLimiter, async (req, res) => {
    const allowedSlugs = ENQUIRY_SERVICE_OPTIONS.map((o) => o.slug);
    const validation = validateEnquiryInput(req.body ?? {}, allowedSlugs);
    if (!validation.valid || !validation.data) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Please correct the highlighted fields.",
        fields: validation.errors
      });
    }
    try {
      const created = await createEnquiry(validation.data, req.ip);
      return res.status(201).json({
        enquiry: created,
        message: "Your consultation request has been received by SIGN IN DOCUMENTS CLEARING. Please note this is an enquiry submission only and does not constitute a submitted government application."
      });
    } catch (error) {
      return res.status(500).json({
        error: "SubmissionError",
        message: error instanceof Error ? error.message : "Unable to submit enquiry at this time."
      });
    }
  });
  app.get("/api/v1/auth/me", requireAuth, (req, res) => {
    return res.json({
      user: {
        uid: req.dbUser?.uid,
        email: req.dbUser?.email,
        displayName: req.dbUser?.displayName,
        role: req.dbUser?.role
      }
    });
  });
  app.post("/api/v1/auth/logout", requireAuth, async (req, res) => {
    await recordAuditLog({
      actorUid: req.dbUser?.uid,
      actorEmail: req.dbUser?.email,
      action: "ADMIN_LOGOUT",
      entityType: "user",
      entityId: req.dbUser?.uid || "unknown",
      ipAddress: req.ip
    });
    return res.json({ success: true });
  });
  app.get(
    "/api/v1/admin/enquiries",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const result = await listEnquiriesAdmin({
          search: typeof req.query.search === "string" ? req.query.search : void 0,
          status: typeof req.query.status === "string" ? req.query.status : void 0,
          serviceSlug: typeof req.query.serviceSlug === "string" ? req.query.serviceSlug : void 0,
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 20
        });
        return res.json(result);
      } catch (error) {
        return res.status(500).json({
          error: "DatabaseError",
          message: error instanceof Error ? error.message : "Unable to fetch enquiries."
        });
      }
    }
  );
  app.get(
    "/api/v1/admin/enquiries/:id",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: "BadRequest",
          message: "Invalid enquiry ID."
        });
      }
      try {
        const detail = await getEnquiryDetailAdmin(id);
        if (!detail) {
          return res.status(404).json({
            error: "NotFound",
            message: "Enquiry not found."
          });
        }
        return res.json({ item: detail });
      } catch (error) {
        return res.status(500).json({
          error: "DatabaseError",
          message: error instanceof Error ? error.message : "Unable to load enquiry."
        });
      }
    }
  );
  const statusUpdateSchema = z.object({
    status: z.enum(ENQUIRY_STATUSES),
    internalNotes: z.string().max(2e3).optional(),
    note: z.string().max(500).optional()
  });
  app.patch(
    "/api/v1/admin/enquiries/:id/status",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: "BadRequest",
          message: "Invalid enquiry ID."
        });
      }
      const parsed = statusUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "ValidationError",
          message: "Invalid status update payload.",
          issues: parsed.error.issues
        });
      }
      try {
        const updated = await updateEnquiryStatusAdmin({
          id,
          status: parsed.data.status,
          internalNotes: parsed.data.internalNotes !== void 0 ? sanitizeText(parsed.data.internalNotes, 2e3) : void 0,
          note: parsed.data.note ? sanitizeText(parsed.data.note, 500) : void 0,
          actorUid: req.dbUser.uid,
          actorEmail: req.dbUser.email,
          ipAddress: req.ip
        });
        if (!updated) {
          return res.status(404).json({
            error: "NotFound",
            message: "Enquiry not found."
          });
        }
        return res.json({ item: updated });
      } catch (error) {
        return res.status(500).json({
          error: "DatabaseError",
          message: error instanceof Error ? error.message : "Unable to update status."
        });
      }
    }
  );
  app.get(
    "/api/v1/admin/services",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAllServicesAdmin();
        return res.json({ items });
      } catch (error) {
        return res.status(500).json({
          error: "DatabaseError",
          message: "Unable to load services."
        });
      }
    }
  );
  app.put(
    "/api/v1/admin/services/:slug",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const slug = sanitizeText(req.params.slug, 80);
      const schema = z.object({
        shortDescription: z.string().min(10).max(500).optional(),
        fullDescription: z.string().min(20).max(3e3).optional(),
        disclaimer: z.string().min(10).max(1e3).optional(),
        isPublished: z.boolean().optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "ValidationError",
          message: "Invalid service update payload."
        });
      }
      try {
        const updated = await updateServiceAdmin(slug, {
          shortDescription: parsed.data.shortDescription ? sanitizeText(parsed.data.shortDescription, 500) : void 0,
          fullDescription: parsed.data.fullDescription ? sanitizeText(parsed.data.fullDescription, 3e3) : void 0,
          disclaimer: parsed.data.disclaimer ? sanitizeText(parsed.data.disclaimer, 1e3) : void 0,
          isPublished: parsed.data.isPublished
        });
        if (!updated) {
          return res.status(404).json({ error: "NotFound", message: "Service not found." });
        }
        await recordAuditLog({
          actorUid: req.dbUser.uid,
          actorEmail: req.dbUser.email,
          action: "SERVICE_UPDATED",
          entityType: "service",
          entityId: slug,
          ipAddress: req.ip
        });
        return res.json({ item: updated });
      } catch (error) {
        return res.status(500).json({ error: "DatabaseError", message: "Failed to update service." });
      }
    }
  );
  app.get(
    "/api/v1/admin/faqs",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAllFaqsAdmin();
        return res.json({ items });
      } catch {
        return res.status(500).json({ error: "DatabaseError", message: "Unable to load FAQs." });
      }
    }
  );
  app.post(
    "/api/v1/admin/faqs",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const schema = z.object({
        serviceSlug: z.string().min(2).max(80),
        category: z.string().min(2).max(100),
        question: z.string().min(5).max(400),
        answer: z.string().min(10).max(2e3),
        isPublished: z.boolean().optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "ValidationError",
          message: "Please provide a valid FAQ category, question, and answer."
        });
      }
      try {
        const created = await createFaqAdmin({
          serviceSlug: sanitizeText(parsed.data.serviceSlug, 80),
          category: sanitizeText(parsed.data.category, 100),
          question: sanitizeText(parsed.data.question, 400),
          answer: sanitizeText(parsed.data.answer, 2e3),
          isPublished: parsed.data.isPublished ?? true
        });
        await recordAuditLog({
          actorUid: req.dbUser.uid,
          actorEmail: req.dbUser.email,
          action: "FAQ_CREATED",
          entityType: "faq",
          entityId: String(created.id),
          ipAddress: req.ip
        });
        return res.status(201).json({ item: created });
      } catch {
        return res.status(500).json({ error: "DatabaseError", message: "Unable to create FAQ." });
      }
    }
  );
  app.patch(
    "/api/v1/admin/faqs/:id",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "BadRequest", message: "Invalid FAQ ID." });
      }
      const schema = z.object({
        category: z.string().min(2).max(100).optional(),
        question: z.string().min(5).max(400).optional(),
        answer: z.string().min(10).max(2e3).optional(),
        isPublished: z.boolean().optional()
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "ValidationError", message: "Invalid FAQ update." });
      }
      try {
        const updated = await updateFaqAdmin(id, {
          category: parsed.data.category ? sanitizeText(parsed.data.category, 100) : void 0,
          question: parsed.data.question ? sanitizeText(parsed.data.question, 400) : void 0,
          answer: parsed.data.answer ? sanitizeText(parsed.data.answer, 2e3) : void 0,
          isPublished: parsed.data.isPublished
        });
        if (!updated) {
          return res.status(404).json({ error: "NotFound", message: "FAQ not found." });
        }
        await recordAuditLog({
          actorUid: req.dbUser.uid,
          actorEmail: req.dbUser.email,
          action: "FAQ_UPDATED",
          entityType: "faq",
          entityId: String(id),
          ipAddress: req.ip
        });
        return res.json({ item: updated });
      } catch {
        return res.status(500).json({ error: "DatabaseError", message: "Unable to update FAQ." });
      }
    }
  );
  app.delete(
    "/api/v1/admin/faqs/:id",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "BadRequest", message: "Invalid FAQ ID." });
      }
      try {
        const deleted = await deleteFaqAdmin(id);
        if (!deleted) {
          return res.status(404).json({ error: "NotFound", message: "FAQ not found." });
        }
        await recordAuditLog({
          actorUid: req.dbUser.uid,
          actorEmail: req.dbUser.email,
          action: "FAQ_DELETED",
          entityType: "faq",
          entityId: String(id),
          ipAddress: req.ip
        });
        return res.json({ deleted: true });
      } catch {
        return res.status(500).json({ error: "DatabaseError", message: "Unable to delete FAQ." });
      }
    }
  );
  app.get(
    "/api/v1/admin/audit-logs",
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAuditLogs(80);
        return res.json({ items });
      } catch {
        return res.status(500).json({ error: "DatabaseError", message: "Unable to load audit logs." });
      }
    }
  );
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "NotFound", message: "API endpoint not found." });
  });
  if (config.nodeEnv !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexHtml = path.join(distPath, "index.html");
      if (fs.existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
      }
      return res.status(404).send("Application build not found.");
    });
  }
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`SIGN IN DOCUMENTS CLEARING server listening on port ${config.port}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
