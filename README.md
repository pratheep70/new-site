# SIGN IN DOCUMENTS CLEARING — Corporate Website & Enquiry Platform

Full-stack web application for **Sign In Transactions Follow Up Services LLC** (`SIGN IN DOCUMENTS CLEARING`), located on Najda Street, Abu Dhabi, UAE.

## Architecture Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router (`src/pages/*`, `src/components/*`).
- **Backend**: Node.js + Express (`server.ts`) organized into modular domains under `server/modules/` (`auth`, `users`, `services`, `enquiries`, `notifications`, `audit`, `config`, `docs`).
- **Database & ORM**: Cloud SQL for **PostgreSQL** with **Drizzle ORM** (`src/db/schema.ts`, `src/db/index.ts`, `src/db/drizzle.config.ts`). *(Note: Cloud SQL in AI Studio uses Drizzle ORM + PostgreSQL with lazy `pg.Pool` object configuration).*
- **Authentication**: Firebase Authentication (Google Sign-In via popup) with server-side JWT verification (`firebase-admin`) and role-based access control (`ADMIN` allowlist).
- **API Documentation**: OpenAPI 3.0 specification served at `/api/openapi.json` and interactive Swagger UI at `/api/docs`.

## Key Pages & Routes

- `/` — Home page (hero, 6 core services, company overview, who we serve, 4-step process, why work with us, FAQ preview, contact form)
- `/about` — Company profile, service philosophy, client segments
- `/services` — Overview of all six service areas
- `/services/:slug` — Dedicated detail pages (`visa-services`, `pro-services`, `document-clearing`, `business-setup`, `insurance`, `emirates-id`)
- `/how-we-work` — Four-step consultation workflow
- `/faq` — Searchable and filterable FAQ directory
- `/contact` — Direct phone (`0501022663`), WhatsApp (`https://wa.me/971501022663`), email (`signinofficial446@gmail.com`), directions, and consultation enquiry form
- `/privacy-policy` & `/terms-and-conditions` — Draft legal templates pending legal review
- `/admin` — Protected staff portal (Enquiries, Status Updates & History, FAQs management, Audit Log)

## Environment Variables

See `.env.example` for all supported variables:
- `APP_URL`, `PORT`, `NODE_ENV`
- `SQL_HOST`, `SQL_DB_NAME`, `SQL_USER`, `SQL_PASSWORD`, `SQL_ADMIN_USER`, `SQL_ADMIN_PASSWORD` (Cloud SQL runtime & schema management)
- `ADMIN_EMAILS` (comma-separated authorized admin Google emails, e.g. `signinofficial446@gmail.com`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `COMPANY_NOTIFICATION_EMAIL` (optional; when unset, enquiries are still saved to PostgreSQL and logged as `SKIPPED_NOT_CONFIGURED`)
- `VITE_GOOGLE_MAPS_EMBED_URL`, `VITE_DIRECTIONS_URL`

## Commands

- Install dependencies: `npm install`
- Run unit tests: `npm test`
- Type-check: `npm run lint`
- Development server: `npm run dev`
- Production build: `npm run build`
- Production start: `npm start`

## Asset Inventory

- Company Logo (supplied): `/assets/aistudio/signin-company-logo_255d9419.jpeg`
- Hero Image (supplied): `/assets/aistudio/a_bright_modern_corporate_office_scene_with_a_pro_80f5c227.png`
- Document Consultation Photo (generated): `/src/assets/images/document_consultation_desk_1794819066008.jpg`
- Abu Dhabi Corporate District Photo (generated): `/src/assets/images/abudhabi_business_district_1794819066505.jpg`

## Owner Pre-Launch Checklist

1. Confirm custom domain, SSL/HTTPS, and production `APP_URL`.
2. Configure `ADMIN_EMAILS` with authorized company Google accounts before production deployment.
3. Configure SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) to enable live email alerts on new enquiries.
4. Confirm WhatsApp Business routing on `+971 50 102 2663` (`0501022663`).
5. Confirm exact office building pin and set `VITE_GOOGLE_MAPS_EMBED_URL` if an embedded map is desired.
6. Have legal counsel review `/privacy-policy` and `/terms-and-conditions` and insert verified trade licence and retention details.
