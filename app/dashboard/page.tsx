import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { AUDIT_PRICE, AUDIT_STRIPE_URL } from "@/lib/pricing";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";

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
            dashboard — including your capital stack, milestone tracker,
            and strategy playbook.
          </p>
          <a
            href={AUDIT_STRIPE_URL}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unlock for ${AUDIT_PRICE}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <span className="dash-upgrade-fine">
            One-time purchase. No subscription.
          </span>
        </div>
      </div>
    </div>
  );
}