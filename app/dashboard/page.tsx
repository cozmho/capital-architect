import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import ComplianceAudit from "@/components/ComplianceAudit";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/00wdR8h1F0rT8wCdvLaVa00";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";

  // Check Stripe for payment status using Clerk email
  const email = user?.emailAddresses?.[0]?.emailAddress;
  let hasPaid = false;

  if (email) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/check-payment?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      hasPaid = data.paid === true;
    } catch {
      hasPaid = false;
    }
  }

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>
          Your Funding Dashboard
        </h1>
        <p className="dash-sub">
          Welcome back, {firstName}. Here&apos;s your capital architecture overview.
        </p>
      </div>

      {!hasPaid ? (
        /* ==========================================
           UNPAID STATE — Show upgrade prompt
        ========================================== */
        <div className="dash-upgrade">
          <div className="dash-upgrade-card">
            <div className="dash-upgrade-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2>Unlock Your Funding Roadmap</h2>
            <p>
              Purchase your personalized Funding Roadmap to access your full
              dashboard — including your capital stack, dispute templates,
              milestone tracker, and strategy playbook.
            </p>
            <a
              href={STRIPE_PAYMENT_LINK}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock for $350
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className="dash-upgrade-fine">
              One-time purchase. No subscription.
            </span>
          </div>
        </div>
      ) : (
        /* ==========================================
           PAID STATE — Full dashboard
        ========================================== */
        <div className="dash-grid">
          {/* MCP-20 Compliance Audit */}
          <ComplianceAudit items={[
            { id: "ein", label: "Tax ID (EIN)", status: "pass", description: "Business EIN is registered and active." },
            { id: "entity", label: "Legal Entity", status: "pass", description: "LLC/Corp is in good standing with SOS." },
            { id: "bank", label: "Business Bank", status: "pass", description: "Dedicated commercial banking active." },
            { id: "email", label: "Prof. Email", status: "fail", description: "Use @domain.com instead of @gmail.com." },
            { id: "address", label: "Business Address", status: "fail", description: "Commercial or Virtual office required." },
            { id: "phone", label: "Business Phone", status: "pass", description: "Dedicated business line detected." },
            { id: "website", label: "Business Website", status: "fail", description: "Professional site with SSL required." },
            { id: "duns", label: "D-U-N-S Number", status: "pass", description: "Registration verified with D&B." },
            { id: "naics", label: "NAICS Code", status: "pass", description: "Low-risk industry coding detected." },
            { id: "listings", label: "411/Directory", status: "pending", description: "National directory listing check active." },
          ]} />

          {/* Funding Roadmap Section */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Your Funding Roadmap</h3>
              <span className="dash-card-badge">Tier B</span>
            </div>
            <div className="roadmap-overview">
              <div className="roadmap-stat">
                <span className="roadmap-val">60-90</span>
                <span className="roadmap-lab">Days to Tier A</span>
              </div>
              <p className="dash-sub-text">Based on your score of 69, your primary bottleneck is **Credibility Compliance** and **Metro 2 reporting errors**.</p>
              <button className="btn-outline-gold w-full mt-4">Download PDF Roadmap</button>
            </div>
          </div>

          {/* Template Vault */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Template Vault</h3>
            </div>
            <div className="dash-actions">
              <Link href="/dashboard/dispute-letter" className="dash-action">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>FCRA §611 Dispute Letter</span>
              </Link>
              <div className="dash-action disabled">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                  <path d="M12 1v22M17 5l-5-5-5 5M17 19l-5 5-5-5" />
                </svg>
                <span>Metro 2 Compliance Template (Coming Soon)</span>
              </div>
              <Link href="/contact" className="dash-action">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Custom Letter Support</span>
              </Link>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}
