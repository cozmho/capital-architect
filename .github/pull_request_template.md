## Summary

Describe the change in 2-5 bullets.

- 
- 

## Change Type

- [ ] Bug fix
- [ ] Feature
- [ ] Refactor
- [ ] Docs
- [ ] Build/CI
- [ ] Prisma/schema
- [ ] Auth/routing

## Build Consistency Classification

Classify this PR:

- [ ] Build-breaking fix
- [ ] Risky inconsistency mitigation
- [ ] Documentation drift correction
- [ ] Not applicable

If applicable, add short evidence:

- 

## Verification

Include command evidence run locally:

```bash
npm run lint
npm run type-check
npm run build
```

- [ ] `npm run lint` passed
- [ ] `npm run type-check` passed
- [ ] `npm run build` passed

## Auth / Routing Impact

- [ ] No auth or route behavior changes
- [ ] `proxy.ts` behavior changed (describe below)
- [ ] Dashboard role path behavior validated (`/dashboard/admin`, `/dashboard/closer`, `/dashboard/setter`)

Notes:

- 

## Prisma / Data Impact

- [ ] No Prisma/schema changes
- [ ] Prisma schema changed (describe model/field impact)
- [ ] Migration/validation flow executed for schema changes

Notes:

- 

## Documentation

- [ ] No docs update needed
- [ ] Updated relevant docs (`README.md`, `CONTRIBUTING.md`, `AGENTS.md`, or instruction files)

## Security / Secrets Check

- [ ] No secrets committed
- [ ] `.env` remains ignored
- [ ] `.env.example` stays placeholder-safe

## Release Risk

- [ ] Low
- [ ] Medium
- [ ] High

Risk notes / rollback plan:

- 
