---
name: capital-architect-expert
description: Core architectural and implementation guidelines for the Capital Architect application. Use when writing Next.js code, designing UI with Tailwind v4, working with the Prisma database schema, or building Server Actions.
---

# Capital Architect Expert

## Context

Capital Architect is an enterprise credit compliance and funding portal. You must act as the Lead Architect and Senior Developer.

## Tech Stack
* **Framework:** Next.js 16 (App Router strictly enforced).
* **Database:** PostgreSQL via Supabase.
* **ORM:** Prisma (`npx prisma db push` during prototyping).
* **Styling:** Tailwind CSS v4 utility conventions + shadcn/ui.
* **Authentication:** Clerk via `middleware.ts`.
* **Icons:** Lucide React.

## Architectural Rules

### 1. Vercel Cloud Directives (CRITICAL)
Capital Architect is hosted on Vercel serverless. Obey these limits:
* **No Heavy Backend Binaries:** Puppeteer, Python scripts, or massive PDF rendering engines are forbidden on the server (causes timeouts).
* **Client-Side Delegation:** Heavy processing MUST be offloaded to the user's browser (e.g., lightweight libraries like `html2pdf.js`).
* **Server Actions:** All database mutations (reads/writes) MUST use Next.js async Server Actions (`"use server"`). No traditional API routes for DB writes.

### 2. Authentication & Routing
* **Protection:** Keep dashboard protection in Clerk route-guard middleware via `middleware.ts`.
* **Role Enforcement:** Paths are role-gated:
  - `/dashboard/admin` => `admin`
  - `/dashboard/closer` => `closer`
  - `/dashboard/setter` => `setter`
* **Overrides:** God-mode uses `GOD_MODE_USER_IDS` in `.env.local` to bypass role checks for developers.

### 3. UI & Design Language
* **Dark Mode Default:** Dashboard pages share a premium dark-mode styling (e.g., `bg-slate-950` with `text-slate-50`) unless local patterns dictate otherwise.
* **Responsive:** All UI must be mobile-responsive by default.
* **Tailwind v4:** Prefer Tailwind v4-compatible utility forms.

### 4. Development Workflow
* **Scope:** Use the smallest actionable next step. Do not rewrite 500-line files to change 3 lines.
* **Zero Overwhelm:** Write small, modular, bite-sized components.
* **Environment Variables:** Never commit real secrets. Use `.env.local` for development and keep `.env.example` safe with neutral placeholders.
* **Prisma:** Treat `prisma/schema.prisma` as high-impact. Do not remove existing models/fields unless explicitly requested.

## Validation Checklist Before Completing Work
1. Run `npm run type-check` and resolve TS errors.
2. Confirm changed auth/routing behavior matches role requirements.
3. Verify all Server Actions are marked `"use server"`.
