import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { z } from 'zod';
import { getAppConfig } from './server/modules/config/env.ts';
import {
  requireAdmin,
  requireAuth,
  type AuthRequest,
} from './server/modules/auth/auth.middleware.ts';
import {
  createFaqAdmin,
  deleteFaqAdmin,
  getPublishedServiceBySlug,
  listAllFaqsAdmin,
  listAllServicesAdmin,
  listPublishedFaqs,
  listPublishedServices,
  updateFaqAdmin,
  updateServiceAdmin,
} from './server/modules/services/services.service.ts';
import {
  createEnquiry,
  getEnquiryDetailAdmin,
  listEnquiriesAdmin,
  updateEnquiryStatusAdmin,
} from './server/modules/enquiries/enquiries.service.ts';
import { listAuditLogs, recordAuditLog } from './server/modules/audit/audit.service.ts';
import { buildOpenApiSpec } from './server/modules/docs/openapi.ts';
import { ENQUIRY_SERVICE_OPTIONS, SERVICE_CATALOG } from './src/data/catalog.ts';
import {
  ENQUIRY_STATUSES,
  sanitizeText,
  validateEnquiryInput,
} from './src/utils/validation.ts';

async function startServer() {
  const config = getAppConfig();
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    }),
  );

  const extraCorsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:') ||
          origin.endsWith('.run.app') ||
          origin === config.appUrl ||
          extraCorsOrigins.includes(origin)
        ) {
          return callback(null, true);
        }
        if (config.nodeEnv !== 'production') {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '64kb' }));

  const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'TooManyRequests',
      message:
        'Too many enquiry submissions from this connection. Please wait a few minutes or call 0501022663.',
    },
  });

  const adminLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // OpenAPI & Swagger Documentation
  app.get('/api/openapi.json', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json(buildOpenApiSpec(baseUrl));
  });
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/api/openapi.json' },
      customSiteTitle: 'SIGN IN DOCUMENTS CLEARING — API Docs',
    }),
  );

  // SEO endpoints
  app.get('/robots.txt', (req, res) => {
    const baseUrl = config.appUrl || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /api/',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n'),
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = config.appUrl || `${req.protocol}://${req.get('host')}`;
    const staticRoutes = [
      '/',
      '/about',
      '/services',
      '/how-we-work',
      '/faq',
      '/contact',
      '/privacy-policy',
      '/terms-and-conditions',
      ...SERVICE_CATALOG.map((s) => `/services/${s.slug}`),
    ];

    const urls = staticRoutes
      .map(
        (route) =>
          `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
      )
      .join('\n');

    res
      .type('application/xml')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
      );
  });

  // Health
  app.get('/api/v1/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'sign-in-documents-clearing',
      timestamp: new Date().toISOString(),
    });
  });

  // Public Catalog Endpoints
  app.get('/api/v1/services', async (_req, res) => {
    try {
      const items = await listPublishedServices();
      return res.json({ items });
    } catch (error) {
      return res.status(500).json({
        error: 'DatabaseError',
        message:
          error instanceof Error ? error.message : 'Unable to load services.',
      });
    }
  });

  app.get('/api/v1/services/:slug', async (req, res) => {
    const slug = sanitizeText(req.params.slug, 80);
    try {
      const service = await getPublishedServiceBySlug(slug);
      if (!service) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Service not found.',
        });
      }
      return res.json({ item: service });
    } catch (error) {
      return res.status(500).json({
        error: 'DatabaseError',
        message:
          error instanceof Error ? error.message : 'Unable to load service.',
      });
    }
  });

  app.get('/api/v1/faqs', async (req, res) => {
    const serviceSlug =
      typeof req.query.serviceSlug === 'string'
        ? sanitizeText(req.query.serviceSlug, 80)
        : undefined;
    try {
      const items = await listPublishedFaqs(serviceSlug);
      return res.json({ items });
    } catch (error) {
      return res.status(500).json({
        error: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Unable to load FAQs.',
      });
    }
  });

  // Public Enquiry Submission
  app.post('/api/v1/enquiries', enquiryLimiter, async (req, res) => {
    const allowedSlugs = ENQUIRY_SERVICE_OPTIONS.map((o) => o.slug);
    const validation = validateEnquiryInput(req.body ?? {}, allowedSlugs);

    if (!validation.valid || !validation.data) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Please correct the highlighted fields.',
        fields: validation.errors,
      });
    }

    try {
      const created = await createEnquiry(validation.data, req.ip);
      return res.status(201).json({
        enquiry: created,
        message:
          'Your consultation request has been received by SIGN IN DOCUMENTS CLEARING. Please note this is an enquiry submission only and does not constitute a submitted government application.',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'SubmissionError',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to submit enquiry at this time.',
      });
    }
  });

  // Auth Session Check & Logout Audit
  app.get('/api/v1/auth/me', requireAuth, (req: AuthRequest, res) => {
    return res.json({
      user: {
        uid: req.dbUser?.uid,
        email: req.dbUser?.email,
        displayName: req.dbUser?.displayName,
        role: req.dbUser?.role,
      },
    });
  });

  app.post('/api/v1/auth/logout', requireAuth, async (req: AuthRequest, res) => {
    await recordAuditLog({
      actorUid: req.dbUser?.uid,
      actorEmail: req.dbUser?.email,
      action: 'ADMIN_LOGOUT',
      entityType: 'user',
      entityId: req.dbUser?.uid || 'unknown',
      ipAddress: req.ip,
    });
    return res.json({ success: true });
  });

  // Protected Admin Endpoints
  app.get(
    '/api/v1/admin/enquiries',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      try {
        const result = await listEnquiriesAdmin({
          search:
            typeof req.query.search === 'string' ? req.query.search : undefined,
          status:
            typeof req.query.status === 'string' ? req.query.status : undefined,
          serviceSlug:
            typeof req.query.serviceSlug === 'string'
              ? req.query.serviceSlug
              : undefined,
          page: req.query.page ? Number(req.query.page) : 1,
          limit: req.query.limit ? Number(req.query.limit) : 20,
        });
        return res.json(result);
      } catch (error) {
        return res.status(500).json({
          error: 'DatabaseError',
          message:
            error instanceof Error ? error.message : 'Unable to fetch enquiries.',
        });
      }
    },
  );

  app.get(
    '/api/v1/admin/enquiries/:id',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Invalid enquiry ID.',
        });
      }

      try {
        const detail = await getEnquiryDetailAdmin(id);
        if (!detail) {
          return res.status(404).json({
            error: 'NotFound',
            message: 'Enquiry not found.',
          });
        }
        return res.json({ item: detail });
      } catch (error) {
        return res.status(500).json({
          error: 'DatabaseError',
          message:
            error instanceof Error ? error.message : 'Unable to load enquiry.',
        });
      }
    },
  );

  const statusUpdateSchema = z.object({
    status: z.enum(ENQUIRY_STATUSES),
    internalNotes: z.string().max(2000).optional(),
    note: z.string().max(500).optional(),
  });

  app.patch(
    '/api/v1/admin/enquiries/:id/status',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Invalid enquiry ID.',
        });
      }

      const parsed = statusUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid status update payload.',
          issues: parsed.error.issues,
        });
      }

      try {
        const updated = await updateEnquiryStatusAdmin({
          id,
          status: parsed.data.status,
          internalNotes:
            parsed.data.internalNotes !== undefined
              ? sanitizeText(parsed.data.internalNotes, 2000)
              : undefined,
          note: parsed.data.note ? sanitizeText(parsed.data.note, 500) : undefined,
          actorUid: req.dbUser!.uid,
          actorEmail: req.dbUser!.email,
          ipAddress: req.ip,
        });

        if (!updated) {
          return res.status(404).json({
            error: 'NotFound',
            message: 'Enquiry not found.',
          });
        }
        return res.json({ item: updated });
      } catch (error) {
        return res.status(500).json({
          error: 'DatabaseError',
          message:
            error instanceof Error ? error.message : 'Unable to update status.',
        });
      }
    },
  );

  app.get(
    '/api/v1/admin/services',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAllServicesAdmin();
        return res.json({ items });
      } catch (error) {
        return res.status(500).json({
          error: 'DatabaseError',
          message: 'Unable to load services.',
        });
      }
    },
  );

  app.put(
    '/api/v1/admin/services/:slug',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const slug = sanitizeText(req.params.slug, 80);
      const schema = z.object({
        shortDescription: z.string().min(10).max(500).optional(),
        fullDescription: z.string().min(20).max(3000).optional(),
        disclaimer: z.string().min(10).max(1000).optional(),
        isPublished: z.boolean().optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid service update payload.',
        });
      }

      try {
        const updated = await updateServiceAdmin(slug, {
          shortDescription: parsed.data.shortDescription
            ? sanitizeText(parsed.data.shortDescription, 500)
            : undefined,
          fullDescription: parsed.data.fullDescription
            ? sanitizeText(parsed.data.fullDescription, 3000)
            : undefined,
          disclaimer: parsed.data.disclaimer
            ? sanitizeText(parsed.data.disclaimer, 1000)
            : undefined,
          isPublished: parsed.data.isPublished,
        });

        if (!updated) {
          return res.status(404).json({ error: 'NotFound', message: 'Service not found.' });
        }

        await recordAuditLog({
          actorUid: req.dbUser!.uid,
          actorEmail: req.dbUser!.email,
          action: 'SERVICE_UPDATED',
          entityType: 'service',
          entityId: slug,
          ipAddress: req.ip,
        });

        return res.json({ item: updated });
      } catch (error) {
        return res.status(500).json({ error: 'DatabaseError', message: 'Failed to update service.' });
      }
    },
  );

  app.get(
    '/api/v1/admin/faqs',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAllFaqsAdmin();
        return res.json({ items });
      } catch {
        return res.status(500).json({ error: 'DatabaseError', message: 'Unable to load FAQs.' });
      }
    },
  );

  app.post(
    '/api/v1/admin/faqs',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const schema = z.object({
        serviceSlug: z.string().min(2).max(80),
        category: z.string().min(2).max(100),
        question: z.string().min(5).max(400),
        answer: z.string().min(10).max(2000),
        isPublished: z.boolean().optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Please provide a valid FAQ category, question, and answer.',
        });
      }

      try {
        const created = await createFaqAdmin({
          serviceSlug: sanitizeText(parsed.data.serviceSlug, 80),
          category: sanitizeText(parsed.data.category, 100),
          question: sanitizeText(parsed.data.question, 400),
          answer: sanitizeText(parsed.data.answer, 2000),
          isPublished: parsed.data.isPublished ?? true,
        });

        await recordAuditLog({
          actorUid: req.dbUser!.uid,
          actorEmail: req.dbUser!.email,
          action: 'FAQ_CREATED',
          entityType: 'faq',
          entityId: String(created.id),
          ipAddress: req.ip,
        });

        return res.status(201).json({ item: created });
      } catch {
        return res.status(500).json({ error: 'DatabaseError', message: 'Unable to create FAQ.' });
      }
    },
  );

  app.patch(
    '/api/v1/admin/faqs/:id',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'BadRequest', message: 'Invalid FAQ ID.' });
      }
      const schema = z.object({
        category: z.string().min(2).max(100).optional(),
        question: z.string().min(5).max(400).optional(),
        answer: z.string().min(10).max(2000).optional(),
        isPublished: z.boolean().optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'ValidationError', message: 'Invalid FAQ update.' });
      }

      try {
        const updated = await updateFaqAdmin(id, {
          category: parsed.data.category
            ? sanitizeText(parsed.data.category, 100)
            : undefined,
          question: parsed.data.question
            ? sanitizeText(parsed.data.question, 400)
            : undefined,
          answer: parsed.data.answer ? sanitizeText(parsed.data.answer, 2000) : undefined,
          isPublished: parsed.data.isPublished,
        });
        if (!updated) {
          return res.status(404).json({ error: 'NotFound', message: 'FAQ not found.' });
        }

        await recordAuditLog({
          actorUid: req.dbUser!.uid,
          actorEmail: req.dbUser!.email,
          action: 'FAQ_UPDATED',
          entityType: 'faq',
          entityId: String(id),
          ipAddress: req.ip,
        });

        return res.json({ item: updated });
      } catch {
        return res.status(500).json({ error: 'DatabaseError', message: 'Unable to update FAQ.' });
      }
    },
  );

  app.delete(
    '/api/v1/admin/faqs/:id',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (req: AuthRequest, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'BadRequest', message: 'Invalid FAQ ID.' });
      }

      try {
        const deleted = await deleteFaqAdmin(id);
        if (!deleted) {
          return res.status(404).json({ error: 'NotFound', message: 'FAQ not found.' });
        }

        await recordAuditLog({
          actorUid: req.dbUser!.uid,
          actorEmail: req.dbUser!.email,
          action: 'FAQ_DELETED',
          entityType: 'faq',
          entityId: String(id),
          ipAddress: req.ip,
        });

        return res.json({ deleted: true });
      } catch {
        return res.status(500).json({ error: 'DatabaseError', message: 'Unable to delete FAQ.' });
      }
    },
  );

  app.get(
    '/api/v1/admin/audit-logs',
    adminLimiter,
    requireAuth,
    requireAdmin,
    async (_req, res) => {
      try {
        const items = await listAuditLogs(80);
        return res.json({ items });
      } catch {
        return res.status(500).json({ error: 'DatabaseError', message: 'Unable to load audit logs.' });
      }
    },
  );

  // Unknown API routes return JSON 404
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'NotFound', message: 'API endpoint not found.' });
  });

  // Frontend middleware or static build
  if (config.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
      }
      return res.status(404).send('Application build not found.');
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`SIGN IN DOCUMENTS CLEARING server listening on port ${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
