# Capital Architect Claude Instructions

This file is the primary project instruction surface for Claude in this workspace.
Treat it as confidential operational guidance for the repository and keep sensitive context out of responses unless the user explicitly asks for it.

## Confidentiality

- Do not echo secrets, tokens, keys, raw environment values, or other private operational details from the workspace.
- Prefer masked placeholders and high-level summaries when referring to sensitive financial, legal, or identity-related material.
- Keep internal strategy, underwriting notes, and project progress concise and private.

## Compliance And Safety

- For credit, funding, and dispute work, stay anchored to objective, verifiable facts and compliance-oriented analysis.
- Use FCRA, Regulation V, Metro 2, SOC 2, and PCI DSS as relevant guardrails, but do not invent legal conclusions.
- If a request would require legal advice or disclosure of confidential strategy, flag the limitation and keep the response narrowly scoped.

## Session Logging

- Use the repository-root `memory.md` file as the session continuity ledger.
- Store only sanitized session notes, decisions, and next steps there.
- Never write credentials, tokens, raw PII, or unreleased business details into `memory.md`.
- Treat `memory.md` as private workspace context, not as a public artifact.
- Structure `memory.md` as a compact session ledger with these sections:
	- `Consumer Protection & Compliance Ledger`: sanitized dispute actions, identified data-quality issues, and any pending statutory timelines.
	- `Capital Sequencing & Underwriting State`: summary of funding simulations, eligibility notes, and any non-sensitive risk flags.
	- `Enterprise Security & Architecture Integrity`: file-handling and parsing notes, plus confirmation that sensitive-data handling stayed within policy.
	- `Strategic Continuity and Next Steps`: chronological digest of decisions, pivots, and the next action items.
- Use objective, high-level summaries in `memory.md`; omit account numbers, raw identifiers, secrets, and operationally sensitive detail.
- At the end of each session, update `memory.md` with the day’s key decisions, strategic patterns, and pending timelines in sanitized form.
- Keep the logging prompt concise and consistent: Update memory.md with today's key decisions, strategic patterns, and pending timelines.

## B.L.A.S.T. Framework Adoption

This project follows the **B.L.A.S.T.** (Blueprint, Linkages, Architecture, Stylize, Trigger) framework for development and architectural integrity.

- **B - Blueprint:** Refer to `blueprint.md` for the core purpose and features of the project. Always consult this file before proposing new features.
- **L - Linkages:** Understand how components (Clerk, Prisma, Supabase, Resend, Stripe) are interconnected as defined in the `blueprint.md`.
- **A - Architecture:** Adhere to the established Next.js 16 App Router folder structure and logic. Maintain clear separation between server actions, API routes, and shared libraries.
- **S - Stylize:** Follow the premium dark-mode aesthetic using Tailwind CSS v4 and Lucide React as established in existing UI components.
- **T - Trigger:** Use the verified commands (`npm run dev`, `npm run lint`, etc.) to trigger development, validation, and deployment cycles.

## Repo Alignment

- Follow the active repository guidance in `AGENTS.md`.
- Preserve the existing Next.js 16, Clerk, Prisma, and Tailwind conventions already established in the codebase.
- Maintain `memory.md` as the source of truth for session continuity.

@AGENTS.md
