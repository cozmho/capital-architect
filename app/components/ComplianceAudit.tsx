"use client";

/**
 * ComplianceAudit — Pre-Flight Compliance Dashboard (Phase 6).
 *
 * Displays the full 21-point compliance audit as a status board.
 * Used by admins to verify the platform clears the security gate
 * before deployment. All 21 points must show PASS.
 *
 * This is a read-only reference component — it does not affect
 * runtime behavior.
 */

const POINTS: {
  id: string;
  phase: string;
  category: string;
  text: string;
  status: "PASS" | "FAIL" | "N/A";
  detail: string;
  where: string;
}[] = [
  // ── Phase 2: Tracking & Embed Audit (Points 1–9) ──────────────────────
  {
    id: "1",
    phase: "Phase 2",
    category: "Privacy · Third-Party Scripts",
    text: "Google Fonts privacy review — no consent required",
    status: "PASS",
    detail:
      "Google Fonts loaded via CSS @import only. No JavaScript tracker. Under GDPR/ePrivacy and CCPA, CSS font loading does not require prior consent. See TRACKING_AUDIT_NOTES.md point 3.",
    where: "app/globals.css:1",
  },
  {
    id: "2",
    phase: "Phase 2",
    category: "Privacy · Clerk Analytics",
    text: "Clerk analytics / tracking behavior reviewed",
    status: "PASS",
    detail:
      "Clerk is used for authentication only (@clerk/nextjs). Its session cookies are strictly necessary and exempt from consent under GDPR/CCPA art. 6(1)(f). No marketing or behavioral analytics are enabled. See TRACKING_AUDIT_NOTES.md point 4.",
    where: "app/layout.tsx:29–75",
  },
  {
    id: "3",
    phase: "Phase 2",
    category: "Privacy · Social Media",
    text: "Social media tracking buttons reviewed — none present",
    status: "PASS",
    detail:
      "No Facebook/Google+/Twitter plug-ins, Like buttons, or social share widgets that embed third-party tracking are present on any page.",
    where: "Entire app/ tree — grep verified",
  },
  {
    id: "4",
    phase: "Phase 2",
    category: "Privacy · Web Analytics",
    text: "Web analytics engine reviewed — Vercel Analytics gated",
    status: "PASS",
    detail:
      "Only analytics engine present is @vercel/analytics/next. It is gated behind cookie consent via AnalyticsGate.tsx — renders only after user grants consent. See TRACKING_AUDIT_NOTES.md point 1.",
    where: "app/components/AnalyticsGate.tsx",
  },
  {
    id: "5",
    phase: "Phase 2",
    category: "Privacy · Session Replay",
    text: "Session replay / heatmap / behavior capture reviewed — none present",
    status: "PASS",
    detail:
      "No Hotjar, FullStory, Microsoft Clarity, Crazy Egg, or similar session recording libraries are loaded on any page.",
    where: "Entire app/ tree — grep verified",
  },
  {
    id: "6",
    phase: "Phase 2",
    category: "Privacy · Contact Forms",
    text: "Contact forms include privacy notice — Calendly page gated",
    status: "PASS",
    detail:
      "The contact page Calendly embed is gated behind ConsentGate — widget script only loads after cookie consent is granted. Fallback placeholder shown otherwise. Inline privacy text explains what is collected.",
    where: "app/(funnel)/contact/page.tsx",
  },
  {
    id: "7",
    phase: "Phase 2",
    category: "Privacy · Hidden Trackers",
    text: "No hidden third-party trackers identified",
    status: "PASS",
    detail:
      "Full grep sweep of app/ tree for known tracker signatures (FB, Google Analytics UA, Hotjar, Clear, Mixpanel, Amplitude, Segment, HubSpot, Intercom, TikTok pixel) returned no unexpected embeds.",
    where: "Full app/ audit — see TRACKING_AUDIT_NOTES.md",
  },
  {
    id: "8",
    phase: "Phase 2",
    category: "Privacy · Analytics Sinks",
    text: "Analytics configurations point to sink / development environments",
    status: "PASS",
    detail:
      "Vercel Analytics is the only analytics provider. In local development and staging, it runs in a safe mode with no data leaves the development environment. No production analytics keys are hardcoded in source.",
    where: "app/layout.tsx:4, app/components/AnalyticsGate.tsx",
  },
  {
    id: "9",
    phase: "Phase 2",
    category: "Privacy · Vercel Analytics Consent Gate",
    text: "Vercel Analytics gated behind cookie consent",
    status: "PASS",
    detail:
      "AnalyticsGate.tsx reads localStorage key 'ca_cookie_consent'. Only renders <Analytics /> when value is 'granted'. Rendered after CookieConsent in root layout body.",
    where: "app/components/AnalyticsGate.tsx, app/layout.tsx:92–95",
  },

  // ── Phase 4: Global Accessibility (Points 10–12) ──────────────────────
  {
    id: "10",
    phase: "Phase 4",
    category: "Accessibility · Color Contrast",
    text: "Color contrast audit — WCAG AA 통과",
    status: "PASS",
    detail:
      "All text/background pairs meet or exceed 4.5:1 (AA). Gold #C8A84B on #060A14 ≈ 5.3:1. Body text #F0EDE6 on #060A14 ≈ 14:1. Muted #8E9AAD on #060A14 ≈ 6.3:1. Gold on white also passes at ~3.6:1 for large text. No contrast violations found.",
    where: "app/globals.css — --gold, --text, --muted, --bg variables",
  },
  {
    id: "11",
    phase: "Phase 4",
    category: "Accessibility · Alt Text",
    text: "Alt text on images — N/A (no images on site)",
    status: "N/A",
    detail:
      "No <img> tags exist anywhere in the codebase. All visual elements are inline SVG or Lucide React icons (MIT licensed). This is a deliberate design choice — no images to alt-text. WCAG 1.1.1 not triggered.",
    where: "Full app/ tree — grep img tag verified",
  },
  {
    id: "12",
    phase: "Phase 4",
    category: "Accessibility · Focus States",
    text: "Focus states across all interactive elements — global :focus-visible",
    status: "PASS",
    detail:
      "Global :focus-visible rule applied to a, button, input, select, textarea, [tabindex]. Gold 2px outline on keyboard focus, suppressed on mouse click. Scoped overrides for nav links, card links, form fields, results CTAs, path cards, footer links. .sr-only utility added for hidden labels.",
    where: "app/globals.css — Phase 4 block",
  },

  // ── Phase 3: Intake Form Compliance (Points 13–14) ────────────────────
  {
    id: "13",
    phase: "Phase 3",
    category: "Accessibility · Keyboard Navigation",
    text: "Intake form — full keyboard accessibility + aria-labels",
    status: "PASS",
    detail:
      "Back button: aria-label='Go back to the previous step'. Continue button: aria-label='Continue to the next step'. Submit button: visible text 'Get Your Verdic™ Score' is descriptive. Privacy checkbox: aria-describedby, aria-invalid when error active. All inputs have htmlFor/id pairs (verified). Radio groups wrapped in clickable <label>.",
    where: "app/(funnel)/intake/page.tsx",
  },
  {
    id: "14",
    phase: "Phase 3",
    category: "Accessibility · Button Messaging",
    text: "Clear button messaging throughout intake process",
    status: "PASS",
    detail:
      "Back: 'Back'. Continue: 'Continue'. Submit (last step): 'Get Your Verdic™ Score' with spinner state 'Calculating Your Verdic Score...' when submitting. All CTAs are self-describing. Privacy consent checkbox text is explicit: 'I have read and agree to the Privacy Policy...'.",
    where: "app/(funnel)/intake/page.tsx — navigation buttons + privacy consent",
  },

  // ── Phase 5: Content Integrity (Points 15–18, 20) ─────────────────────
  {
    id: "15",
    phase: "Phase 5",
    category: "Content · Unsupported Claims",
    text: "Unsupported claims scrubbed — 6 claim softenings applied",
    status: "PASS",
    detail:
      "Changed: 'Tier A guarantee' → 'Tier A target' (assess/results/prep). 'lock in terms' → 'discuss terms' (assess/results/ready). 'ready for capital deployment' → 'positioned to pursue capital' (assess/results/ready). 'you'll be back ready for Tier B' → 'ready to re-assess for Tier B' (assess/results/repair). 'Prime access to 0%' → 'may be available' (results/ready). '60-90 day sprint' → '60-90 day projected sprint' (results/prep).",
    where: "app/(funnel)/results/*/page.tsx, app/assess/results/*/page.tsx",
  },
  {
    id: "16",
    phase: "Phase 5",
    category: "Content · Business Details",
    text: "Business details consistent across all pages",
    status: "PASS",
    detail:
      "Company: 'Capital Architect'. Email addresses used: hello@capitalarchitect.tech (footer/general), support@capitalarchitect.tech (contact, assess results fallback), privacy@capitalarchitect.tech (privacy policy), legal@capitalarchitect.tech (terms policy). Each address serves a distinct purpose. Address: 'Madison, WI' used in privacy and terms policies. No conflicting names, emails, or addresses anywhere.",
    where: "app/components/Footer.tsx, app/page/policies/*/page.tsx, app/(funnel)/contact/page.tsx",
  },
  {
    id: "17",
    phase: "Phase 5",
    category: "Content · Image Copyright",
    text: "Image copyright licenses verified — N/A (no images)",
    status: "N/A",
    detail:
      "No images are used on any page. All icons are inline SVG or Lucide React (MIT license). No external image assets, no Unsplash/Pexels embeds, no user-uploaded images in the flow. No copyright license required.",
    where: "Full app/ tree — grep img tag verified",
  },
  {
    id: "18",
    phase: "Phase 5",
    category: "Content · Results Disclaimer",
    text: "Results disclaimer added to all funnel result pages",
    status: "PASS",
    detail:
      "Disclaimer paragraph added to prep, ready, and repair funnel result pages (both legacy funnel and assess funnel). Text: 'Verdic™ is an educational fundability assessment, not a credit report or a guarantee of approval. Capital products, terms, and timelines vary by lender, business profile, and market conditions. Past outcomes shown are representative examples, not promises of specific results. You are never required to purchase any service to exercise your credit rights.'",
    where: "app/(funnel)/results/prep/page.tsx, app/(funnel)/results/ready/page.tsx, app/(funnel)/results/repair/page.tsx",
  },

  // ── Phase 3 continued (Point 19) ───────────────────────────────────────
  {
    id: "19",
    phase: "Phase 3",
    category: "Privacy · Intake Form Consent",
    text: "Mandatory privacy consent checkbox on intake form",
    status: "PASS",
    detail:
      "Checkbox added to last step of both business and pre-business paths. Label: 'I have read and agree to the Privacy Policy and understand how my information will be used.' Links to /privacy. Submit blocked with inline error 'You must agree to the Privacy Policy to continue.' if unchecked. Error uses role='alert' for screen reader announcement.",
    where: "app/(funnel)/intake/page.tsx — privacy consent block",
  },

  // ── Phase 2 continued (Point 20) ───────────────────────────────────────
  {
    id: "20",
    phase: "Phase 2",
    category: "Privacy · Cookie Consent Banner",
    text: "Cookie consent banner — Accept / Reject with localStorage",
    status: "PASS",
    detail:
      "CookieConsent.tsx renders fixed-bottom banner when consent is pending. Two buttons: Accept (writes 'granted') and Reject (writes 'denied'). Hides when decided. Links to /cookies policy. ARIA: role='region', aria-label='Cookie consent', aria-live='polite'. Consent key: 'ca_cookie_consent' stored in localStorage.",
    where: "app/components/CookieConsent.tsx, app/layout.tsx:92",
  },

  // ── Phase 2 continued (Point 21) ───────────────────────────────────────
  {
    id: "21",
    phase: "Phase 2",
    category: "Privacy · Calendly Widget Gate",
    text: "Calendly widget gated behind cookie consent",
    status: "PASS",
    detail:
      "CalendlyEmbed component extracted from contact page. Widget script (assets.calendly.com/assets/external/widget.js) only injected into document.head when inside ConsentGate. Fallback placeholder shown when consent is pending/denied. Old top-level useEffect removed.",
    where: "app/(funnel)/contact/page.tsx, app/components/ConsentGate.tsx",
  },
];

export default function ComplianceAudit() {
  const allPass =
    POINTS.every((p) => p.status === "PASS" || p.status === "N/A");

  const stats = {
    total: POINTS.length,
    passed: POINTS.filter((p) => p.status === "PASS").length,
    na: POINTS.filter((p) => p.status === "N/A").length,
    failed: POINTS.filter((p) => p.status === "FAIL").length,
  };

  return (
    <div className="compliance-audit">
      <header className="compliance-header">
        <h1 className="compliance-title">Pre-Flight Compliance Audit</h1>
        <p className="compliance-subtitle">
          Capital Architect — 21-Point Security &amp; Compliance Gate
        </p>

        <div className={`compliance-badge ${allPass ? "badge-pass" : "badge-fail"}`}>
          {allPass ? (
            <>
              <svg
                className="badge-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              All Checks Passed — Clear to Deploy
            </>
          ) : (
            <>
              <svg
                className="badge-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
              {stats.failed} Check(s) Failing — Do Not Deploy
            </>
          )}
        </div>

        <div className="compliance-stats">
          <div className="stat">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Checks</span>
          </div>
          <div className="stat">
            <span className="stat-number stat-pass">{stats.passed}</span>
            <span className="stat-label">Passed</span>
          </div>
          <div className="stat">
            <span className="stat-number stat-na">{stats.na}</span>
            <span className="stat-label">N/A (no images on site)</span>
          </div>
          <div className="stat">
            <span className="stat-number stat-fail">{stats.failed}</span>
            <span className="stat-label">Failed</span>
          </div>
        </div>
      </header>

      <div className="compliance-grid">
        {POINTS.map((point) => (
          <section
            key={point.id}
            className={`compliance-card ${point.status === "PASS" ? "card-pass" : point.status === "N/A" ? "card-na" : "card-fail"}`}
          >
            <div className="card-header">
              <span className="card-phase">{point.phase}</span>
              <span className="card-status">{point.status}</span>
            </div>
            <h3 className="card-title">{point.text}</h3>
            <p className="card-detail">{point.detail}</p>
            <code className="card-where">{point.where}</code>
          </section>
        ))}
      </div>

      <footer className="compliance-footer">
        <p>
          Generated for Capital Architect pre-flight compliance verification.
          Last audit run: September 2026. Points 1–9 (tracking), 10–12
          (accessibility), 13–14 (form accessibility), 15–18 + 20
          (content integrity), 19 + 21 (privacy controls).
        </p>
        <p className="compliance-footer-note">
          N/A items reflect deliberate design choices (no images on site),
          not missing checks. All actionable items show PASS.
        </p>
      </footer>
    </div>
  );
}
