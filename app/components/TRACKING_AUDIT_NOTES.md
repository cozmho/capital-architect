/**
 * Phase 2 — Tracking & Embed Audit Notes (points 8, 9)
 *
 * Third-party scripts in this app and their consent status:
 *
 * 1. Vercel Analytics (`@vercel/analytics/next`, `<Analytics />`)
 *    → GATED behind cookie consent via AnalyticsGate.tsx. Loads only after
 *      user grants consent in CookieConsent banner. (Point 8 — tracking audit.)
 *
 * 2. Calendly Widget (`assets.calendly.com/assets/external/widget.js`)
 *    → GATED behind cookie consent via ConsentGate in
 *      app/(funnel)/contact/page.tsx. Widget script and inline embed div
 *      only render after user grants consent. Fallback placeholder shown
 *      when consent is pending/denied. (Point 9 — 3rd party embeds.)
 *
 * 3. Google Fonts (`fonts.googleapis.com` CSS import in globals.css)
 *    → NOT gated. CSS resource, not a JS tracker. Under GDPR/ePrivacy and
 *      CCPA, CSS font loading does not require prior consent.
 *      If strict no-external-requests-without-consent is required, self-host
 *      the .woff2 files in /public/fonts/ instead.
 *
 * 4. Clerk (`@clerk/nextjs`) — authentication
 *    → ESSENTIAL. Required for app functionality (sign in/up, user profile).
 *      Not gated. Clerk sets its own session cookies — these are strictly
 *      necessary for auth and are exempt from consent under GDPR/CCPA art. 6(1)(f)
 *      / \"necessary\" category. (Point 9 — 3rd party embeds.)
 *
 * 5. Supabase Auth — used via Clerk integration only
 *    → Not a separate client-side script. Supabase client is used server-side
 *      (in actions and API routes). No client-side Supabase script is loaded.
 *
 * 6. Stripe.js / Stripe payment elements
 *    → Loads only on checkout/assessment payment pages when the user initiates
 *      a payment flow. Essential for the payment function — exempted from consent.
 *      Not loaded on every page. (Point 9.)
 *
 * 7. Stripe checkout links (`buy.stripe.com`)
 *    → These are redirect links (not Stripe.js embeds) on results pages.
 *      No frontend script loaded — no consent required.
 *
 * 8. Google Gemini API
 *    → Server-side only (`app/api/gemini/thinking/route.ts`). No client-side
 *      component. Not gated. (Per spec.)
 *
 * Components built in Phase 2:
 *   - app/components/CookieConsent.tsx  — fixed-bottom banner, localStorage,
 *     Accept/Reject buttons, link to /cookies policy
 *   - app/components/ConsentGate.tsx    — reusable gate for non-essential embeds
 *   - app/components/AnalyticsGate.tsx  — specific gate for Vercel Analytics
 *
 * Consent key: `ca_cookie_consent`
 *   Values: "granted" | "denied" | absent (pending)
 *   Storage: localStorage (client-side, survives reloads)
 *
 * Audit result: Vercel Analytics and Calendly Widget required gating.
 * All other third-party scripts are either essential (Clerk, Stripe payment)
 * or server-side only (Supabase, Gemini API).
 */


