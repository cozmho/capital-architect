# Capital Architect Blueprint

## B - Blueprint (Core Purpose & Features)

**Core Purpose:** 
Capital Architect is an enterprise-grade credit compliance and funding portal designed to help business owners achieve "fundability" through automated assessment, scoring, and strategic guidance.

**Key Features:**
1.  **Fundability Assessment:** A multi-tier scoring engine (Verdic™) that evaluates business credit health based on FICO, revenue, and time in business.
2.  **Lead Magnet System:** Automated delivery of a "Fundability Blueprint" via Resend upon lead submission.
3.  **Tiered Results:** Dynamic landing pages for `READY`, `PREP`, and `REPAIR` states with specific calls to action (CTAs).
4.  **Admin/God-Mode Dashboard:** Centralized lead management, scoring overrides, and conversion tracking.
5.  **Role-Based Dashboards:** Specific views for Clients, Setters, and Closers, protected by Clerk middleware.
6.  **Payment Integration:** Stripe-powered checkout for the "Funding Readiness Intensive" program.

## L - Linkages (System Connections)

**Authentication & Authorization:**
- **Clerk:** Manages user identity, session persistence, and role-based access control (RBAC). 
- **Middleware:** Enforces dashboard protection and redirects based on Clerk roles (`admin`, `closer`, `setter`, `client`).

**Data & Persistence:**
- **Next.js 16 (App Router):** The core application framework.
- **Prisma 7:** ORM for type-safe database access.
- **Supabase Postgres:** The primary data store.
- **Linkage:** `app/actions` -> `Prisma` -> `Supabase`.

**Communications & Transactions:**
- **Resend:** Handles transactional email delivery (Blueprints, welcome emails).
- **Stripe:** Processes payments and triggers webhooks to update lead status.
- **Linkage:** `Stripe Webhook` -> `app/api/webhooks/stripe` -> `Prisma` (Update Lead Status).

## A - Architecture (Folder Structure & Logic)

- `app/`: Next.js App Router routes, layouts, and components.
- `app/actions/`: Server Actions for business logic (Scoring, Leads, Email).
- `app/api/`: API routes (Intake, Webhooks, AI Thinking).
- `app/dashboard/`: Role-specific dashboard views.
- `lib/`: Shared utility singletons (Prisma, Clerk, Resend, Stripe, Gemini).
- `prisma/`: Database schema and migration configurations.
- `public/`: Static assets and reference material.
- `scripts/`: Maintenance and health-check scripts.

## S - Stylize (UI/UX Conventions)

- **Design System:** Premium dark-mode aesthetic (`bg-slate-950`, `text-slate-50`).
- **Framework:** Tailwind CSS v4 for utility-first styling.
- **Icons:** Lucide React for consistent visual language.
- **Responsiveness:** Mobile-first design for all dashboards and assessment pages.

## T - Trigger (Commands & Workflow)

- `npm run dev`: Start development environment.
- `npm run lint`: Run code quality checks.
- `npm run type-check`: Validate TypeScript integrity.
- `npm run build`: Generate production-ready assets.
- `npm run prisma:generate`: Update Prisma client after schema changes.
- `npm run test:e2e`: Execute Playwright smoke tests.
