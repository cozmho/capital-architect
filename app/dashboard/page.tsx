import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

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
          {/* Verdic Score Card */}
          <div className="dash-card dash-score-card">
            <div className="dash-card-header">
              <h3>Verdic™ Score</h3>
              <span className="dash-card-badge">Live</span>
            </div>
            <div className="dash-score-value">—</div>
            <p className="dash-score-tier">Take the assessment to see your score</p>
            <Link href="/intake" className="link-gold">
              Take Assessment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="dash-actions">
              <Link href="/intake" className="dash-action">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Retake Assessment</span>
              </Link>
              <Link href="/contact" className="dash-action">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Book Strategy Call</span>
              </Link>
              <a href={STRIPE_PAYMENT_LINK} className="dash-action" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>View Funding Roadmap</span>
              </a>
              <Link href="/dashboard/dispute-letter" className="dash-action">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Generate Dispute Letter</span>
              </Link>
            </div>
          </div>

          {/* Milestone Tracker Placeholder */}
          <div className="dash-card dash-full-width">
            <div className="dash-card-header">
              <h3>Fundability Milestones</h3>
              <span className="dash-card-badge">Coming Soon</span>
            </div>
            <div className="dash-milestones">
              <div className="dash-milestone">
                <div className="milestone-dot completed" />
                <div>
                  <strong>Account Created</strong>
                  <span>Your Capital Architect portal is active</span>
                </div>
              </div>
              <div className="dash-milestone">
                <div className="milestone-dot" />
                <div>
                  <strong>Verdic Assessment</strong>
                  <span>Complete your fundability assessment</span>
                </div>
              </div>
              <div className="dash-milestone">
                <div className="milestone-dot" />
                <div>
                  <strong>Credit Optimization</strong>
                  <span>Dispute errors, reduce utilization, build tradelines</span>
                </div>
              </div>
              <div className="dash-milestone">
                <div className="milestone-dot" />
                <div>
                  <strong>Capital Deployment</strong>
                  <span>Execute your funding roadmap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
