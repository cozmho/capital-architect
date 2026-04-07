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

## Repo Alignment

- Follow the active repository guidance in `AGENTS.md`.
- Preserve the existing Next.js 16, Clerk, Prisma, and Tailwind conventions already established in the codebase.

@AGENTS.md
