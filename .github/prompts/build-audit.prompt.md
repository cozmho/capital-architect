---
description: "Run a verified build inconsistency audit for Capital Architect and classify findings with command evidence"
name: "Build Inconsistency Audit"
argument-hint: "Optional focus area (auth, prisma, dashboard, docs, all)"
agent: "agent"
---
Run a build inconsistency audit for this repository.

If the user provided a focus area argument, prioritize that area while still running the full verification workflow.

Workflow:

1. Check script and config drift first:
- `package.json` scripts (`dev`, `lint`, `build`, `start`)
- `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `prisma.config.ts`

2. Run and use command evidence:
- `npm run lint`
- `npm run type-check`
- `npm run build`

3. Report findings in this order:
- Build-breaking
- Risky inconsistency
- Documentation drift

4. For each finding, include:
- Severity
- Why it matters
- Exact file reference
- Smallest safe fix

5. Do not report style preferences as build failures unless a tool enforces them.
