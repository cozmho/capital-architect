---
description: "Use when auditing or changing Prisma schema, Prisma config, Supabase connection setup, or database-backed API routes. Covers build-consistency and migration-risk checks."
applyTo:
  - "prisma/**/*.prisma"
  - "prisma.config.ts"
  - "lib/prisma.ts"
  - "app/api/**/*.ts"
---
# Prisma Build Audit Rules

Use these rules for schema, client config, and DB-backed API changes.

## Connection Model

- Runtime queries use `DATABASE_URL` through `lib/prisma.ts`.
- Prisma schema operations resolve datasource via `prisma.config.ts` with `DIRECT_URL` fallback handling.
- Keep this split unless there is an explicit migration strategy change.

## Schema Safety

- Keep `prisma/schema.prisma` changes minimal and intentional.
- Do not remove models or fields unless explicitly requested.
- Describe model impact clearly when schema changes are introduced.

## Required Verification

- Run `npm run lint`.
- Run `npm run type-check`.
- Run `npm run build`.
- If schema changed, run relevant Prisma validation/migration flow before merge.

## API Consistency

- Preserve intake route contract in `app/api/intake/route.ts` unless the task requests contract changes.
- Maintain deterministic lead upsert behavior for idempotent intake events.

## Output Standard

When reporting Prisma-related inconsistencies, classify as:

- Build-breaking
- Risky inconsistency
- Documentation drift

Only report build inconsistencies after command evidence.
