---
description: "Use when auditing or changing frontend routes, layouts, pages, or Tailwind classes in App Router. Covers build-consistency checks for dashboard and intake UI."
applyTo: "app/**/*.ts, app/**/*.tsx, app/**/*.css"
---
# Frontend Build Audit Rules

Use these rules when working in `app/` routes and UI code.

## Required Verification

- Run `npm run lint` for all frontend-impacting changes.
- Run `npm run type-check` for all frontend-impacting changes.
- Run `npm run build` for routing, layout, or rendering changes.

## Next.js Conventions

- Keep App Router patterns.
- Do not introduce custom middleware naming; use `middleware.ts`.
- Prefer server components unless client hooks/state are required.

## Tailwind v4 Conventions

- Prefer Tailwind v4 utility forms (for example `bg-linear-to-br`).
- Avoid legacy gradient syntax from older versions.
- Keep dark dashboard visual language consistent with existing pages.

## Routing And Role Safety

- Do not break links or redirects for:
  - `/dashboard/admin`
  - `/dashboard/closer`
  - `/dashboard/setter`
- If route behavior changes, validate role-specific outcomes manually.

## Output Standard

When reporting frontend build inconsistencies, classify as:

- Build-breaking
- Risky inconsistency
- Documentation drift

Only claim build issues with command evidence.
