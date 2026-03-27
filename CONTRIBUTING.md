# Contributing to Capital Architect

Thanks for contributing. This project uses a strict verify-first workflow for build consistency.

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Add local environment values in `.env`:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `INTAKE_API_KEY` (optional for local browser-only testing)

3. Start local development:

```bash
npm run dev
```

## Project Rules

- Use Next.js App Router conventions.
- Keep route protection in `proxy.ts` (do not introduce `middleware.ts`).
- Preserve role guards for `/dashboard/admin`, `/dashboard/closer`, and `/dashboard/setter`.
- Treat `prisma/schema.prisma` as high-impact and keep schema changes minimal.
- Never commit real secrets.

## Build Consistency Workflow

Before opening a PR, run this exact sequence:

1. Check script and config drift:

- Confirm `package.json` scripts still match real workflow (`dev`, `lint`, `build`, `start`).
- Confirm these files do not conflict: `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `prisma.config.ts`.

2. Run verification commands:

```bash
npm run lint
npm run type-check
npm run build
```

3. Classify any issue you find:

- Build-breaking: command failure in lint/build/type generation.
- Risky inconsistency: currently passes but likely CI or cross-env drift.
- Documentation drift: docs and instructions do not match actual behavior.

Only report build inconsistencies after command evidence.

## Pull Request Checklist

- [ ] Scope is focused and minimal.
- [ ] Auth and role-routing behavior still works as expected.
- [ ] `npm run lint` passes.
- [ ] `npm run type-check` passes.
- [ ] `npm run build` passes.
- [ ] Docs were updated if behavior changed.
- [ ] No secrets or env values were committed.

The repository PR template (`.github/pull_request_template.md`) mirrors this checklist and should be completed for every PR.

## CI Enforcement

GitHub Actions runs lint, type-check, and build automatically on pull requests and pushes to `main`.
The workflow is defined in `.github/workflows/ci.yml`.

Security scanning runs via `.github/workflows/security.yml` on pull requests, pushes to `main`, and a weekly schedule.

- Code scanning: CodeQL (`javascript-typescript`)
- Dependency policy gate: `npm audit --audit-level=high` (fails on high/critical findings)

GitHub Actions also auto-labels pull requests by changed paths using `.github/workflows/labeler.yml` and `.github/labeler.yml`.
Create repository labels once (auth, prisma, frontend, ci, docs, security) so the workflow can apply them.

Release notes are drafted automatically on pushes to `main` via `.github/workflows/release-drafter.yml` and `.github/release-drafter.yml`.
Use labels consistently so changelog categories remain accurate.

- Optional version labels: `major`, `minor`, `patch`
- Optional skip label: `skip-changelog`

## Branch Protection Setup (Maintainers)

In GitHub repository settings, protect the `main` branch with:

- Require a pull request before merging.
- Require at least 1 approval.
- Require status checks to pass before merging.
- Select required checks: `verify`, `CodeQL Analysis`, and `npm Audit (high+)`.
- Dismiss stale pull request approvals when new commits are pushed.
- Restrict force pushes and prevent branch deletion.

## CODEOWNERS (Maintainers)

This repository includes `.github/CODEOWNERS` to assign review ownership for critical paths.
For stricter governance, enable "Require review from Code Owners" in branch protection for `main`.

## Useful References

- `README.md` for runtime setup and intake flow.
- `AGENTS.md` for agent workflow and guardrails.
- `proxy.ts` for route protection and role redirects.
- `app/api/intake/route.ts` for intake normalization and tiering logic.

## Issue Reporting

Use GitHub issue templates when opening bugs or enhancements.
The bug form requires reproduction steps and local verification evidence (`npm run lint`, `npm run type-check`, `npm run build`) to keep triage actionable.
