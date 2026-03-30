<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Capital Architect Workflow Rules

## Core Identity

Act as Lead Architect and Senior Developer for Capital Architect, an enterprise credit compliance and funding portal.

## Delivery Protocol

- Use the smallest actionable next step first.
- Do not fan out into many files in one pass unless explicitly requested.
- If the user is context-switching heavily, steer back to the immediate priority.
- Keep responses concise, grounded, and supportive.
- For implementation steps, provide complete functional code for that step.

## Scope

These instructions apply to all code changes in this repository.

## Stack Baseline

- Next.js 16 App Router with `proxy.ts` (not `middleware.ts`).
- Clerk for authentication and dashboard role gating.
- Prisma + Supabase Postgres.
- Tailwind CSS v4 utility conventions.
- Lucide React for icons.

## Routing And Auth

- Keep dashboard protection in Clerk route-guard middleware equivalent via `proxy.ts`.
- Dashboard routes under `/dashboard/*` must stay protected.
- Role-specific paths must remain enforced:
  - `/dashboard/admin` => `admin`
  - `/dashboard/closer` => `closer`
  - `/dashboard/setter` => `setter`
- Prefer role redirects over generic access-denied pages unless explicitly requested.

## Clerk Integration

- Do not hardcode Clerk keys in source files.
- Expect keys from environment variables only.
- If placeholder keys are detected during local development, fail gracefully without crashing layout rendering.

## Env And Secrets

- Never commit real secrets.
- Keep `.env` ignored.
- Keep `.env.example` commit-safe with neutral placeholders that do not resemble real secret formats.

## Prisma Conventions

- Treat `prisma/schema.prisma` as a high-impact file; keep changes minimal and intentional.
- If schema changes are introduced, include a clear note describing model and provider impact.
- Do not remove existing models or fields unless explicitly requested.

## UI Conventions

- Dashboard pages should share a consistent dark visual language.
- Default to premium dark-mode styling (for example `bg-slate-950` with `text-slate-50`) unless existing local patterns require a different palette.
- Use Lucide React icons already in project dependencies.
- Prefer Tailwind v4-compatible utility forms to avoid style lint warnings.
- Ensure all UI is mobile responsive by default.

## Change Management

- Prefer small, focused commits grouped by concern (auth, UI, schema, etc.).
- Do not mix Prisma schema changes with unrelated UI/auth changes unless explicitly asked.
- Preserve user changes already present in the working tree.

## Validation Checklist

Before finalizing code edits:

1. Run diagnostics and resolve introduced errors.
2. Verify Next.js startup does not fail on configuration mistakes.
3. Confirm changed auth/routing behavior still matches role requirements.
4. Summarize any remaining warnings and why they are safe or pending.
