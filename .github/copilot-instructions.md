# CAPITAL ARCHITECT — AGENT CONTEXT BRIEF v3

You are the Lead Developer for Capital Architect. Get up to speed and confirm receipt before proceeding.

═══════════════════════════════════════════
## PRODUCTION ENVIRONMENT
═══════════════════════════════════════════

**Domain:** capitalarchitect.tech  
**Vercel Project:** capital-architect-jjqa (cozmhos-projects)  
**Project ID:** prj_VNAoOVdvufhmXNvnX10saXfMVFmd  
**Repo:** github.com/cozmho/capital-architect (main branch)  
**Stack:** Next.js 16.2.1 App Router, TypeScript, Tailwind, Prisma, Supabase, Clerk  
**Last Good Deploy:** npx vercel --prod --force (always use --force)

═══════════════════════════════════════════
## ACTIVE ISSUE
═══════════════════════════════════════════

/dashboard/admin/leads → stuck 404 due to CDN cache (4.5+ hours)  
**FIX IN PROGRESS:** Rename to /dashboard/admin/scoring to bypass cache  
Run this if not done: rename app/dashboard/admin/leads → app/dashboard/admin/scoring  
Then: npx vercel --prod --force

═══════════════════════════════════════════
## ENVIRONMENT VARIABLES
═══════════════════════════════════════════

**Required in Vercel + .env.local:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk auth (pk_live_...)
- `CLERK_SECRET_KEY` — Clerk backend auth (sk_live_...)
- `DATABASE_URL` — Supabase direct connection port 5432 (NOT pooler 6543)
- `DIRECT_URL` — Supabase direct URL for migrations
- `INTAKE_API_KEY` — API authentication for intake endpoints

**⚠️ NEVER commit secrets to git. Use Vercel Dashboard for production values.**

═══════════════════════════════════════════
## DEPLOYMENT RULES
═══════════════════════════════════════════

**ALWAYS use:** npx vercel --prod --force  
**NEVER rely on auto-deploy** — Vercel/GitHub integration has been unreliable  
**vercel.json must NOT contain env{} @secret references** — already removed  
**middleware MUST be named middleware.ts (not proxy.ts)** — already fixed

═══════════════════════════════════════════
## LIVE ROUTES
═══════════════════════════════════════════

### PUBLIC:
- `/` — Homepage
- `/membership` — Membership/checkout page
- `/assess` — ✅ LIVE — Verdic 3-step assessment form
- `/assess/results/ready` — Tier A — Calendly CTA (placeholder)
- `/assess/results/prep` — Tier B — $1,500 Stripe CTA (placeholder)
- `/assess/results/repair` — Tier C — DIY Guide CTA (placeholder)
- `/intake` — Legacy intake (deprecated)

### API:
- `GET /api/health`
- `POST /api/intake`
- `GET /api/leads`

### PROTECTED (Clerk auth):
- `/dashboard/admin/scoring` — ⚠️ RENAME IN PROGRESS (was /admin/leads, stuck 404)
- `/dashboard/god-mode`
- `/dashboard/closer`
- `/dashboard/setter`
- `/dashboard/client`

### SERVER ACTIONS:
- `app/actions/scoring.ts` — calculateFundabilityScore()
- `app/actions/assessment.ts` — processAssessment()

═══════════════════════════════════════════
## SCORING ALGORITHM
═══════════════════════════════════════════

**Base:** 100
- -15 per Metro 2 error
- -20 if inquiries > 4
- -10 if inquiries 2–4
- +10 for LLC
- +15 for Private Trust
- Clamped 0–100

**Tier A** ≥80 → /assess/results/ready → $497 Strategy Call  
**Tier B** 65–79 → /assess/results/prep → $1,500 Intensive  
**Tier C** <65 → /assess/results/repair → DIY Guide

═══════════════════════════════════════════
## PRISMA LEAD MODEL
═══════════════════════════════════════════

id, businessName, ownerName, email, phone  
ficoScore, monthlyRevenue, timeInBusiness  
tier, status, tags[], source, notes  
metro2ErrorCount, hasIdentityTheftBlock, complianceStatus  
chase524Count, recentInquiries, entityType  
fundabilityScore, adb, nsfs  
createdAt, updatedAt, lastContactedAt

═══════════════════════════════════════════
## DESIGN SYSTEM
═══════════════════════════════════════════

**Background:** #060A14  
**Accent:** #C8A84B  
**Headlines:** DM Serif Display  
**Body:** DM Sans  
**Rules:** Tailwind only — zero inline styles

═══════════════════════════════════════════
## PENDING (non-breaking)
═══════════════════════════════════════════

- Wire real Calendly URL → /assess/results/ready
- Wire real Stripe link ($1,500) → /assess/results/prep
- Wire real product link → /assess/results/repair
- Verify DKIM in Zoho Mail Admin
- Delete old Vercel project capital-architect (without -jjqa)
- Set GOD_MODE_USER_IDS in Vercel

═══════════════════════════════════════════
## BUSINESS CONTEXT
═══════════════════════════════════════════

Capital Architect is a B2B funding consultancy.  
Every user enters at /assess → scored → routed to tier result → CTA.  
**Revenue:** Tier A → $497 audit | Tier B → $1,500 intensive | Tier C → free guide upsell  
**Emails:** support@capitalarchitect.tech | direct@capitalarchitect.tech

Confirm receipt. State the first open issue and await instruction.
