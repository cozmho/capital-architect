# AGENTS.md — Capital Architect Single Source of Truth (Gate 1)

## Hard Rules (Non-Negotiable)
1. **English Only:** Always respond strictly in English, regardless of underlying model routing or ACP client fallback.
2. **CROA & Stripe Firewall:** Never create, modify, or expose consumer credit repair, FCRA §611 dispute letters, or Lob physical mail routes (`/api/lob`, `/api/dispatch-letter`) in this repo. Keep `capitalarchitect.tech` 100% B2B Business Fundability Audit.
3. **Active Scope (Gate 1 Only):** De-bloat unused features (`MCP-20`, `CFO Brain`, `Vapi` voice stubs, programmatic SEO crons) and verify the core revenue loop: Landing -> $497 Stripe Checkout -> `/api/webhooks/stripe` (`STRIPE_WEBHOOK_SECRET`) -> Supabase persistence -> Zoho SMTP confirmation.

## Mandatory 4-Step Execution Sequence
1. **Audit & Quarantine:** Identify dead files/dependencies to move to `_archive/` before writing new code.
2. **Plan First:** Output a max 5-bullet diff plan (max 3 files per task) and stop for user approval.
3. **Minimal Edits:** Use existing dependencies only. Zero new `npm install` without explicit permission.
4. **Verify:** Run `npx tsc --noEmit` and `npm run build` (or report exact command output) before committing with `[GATE-1]`.
