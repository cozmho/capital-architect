"use client";

import { useUser, SignInButton } from "@clerk/nextjs";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/00wdR8h1F0rT8wCdvLaVa00";

export default function MembershipPage() {
  const { isSignedIn, user } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="membership-container">
      <div className="membership-header">
        <div className="section-eyebrow">FUNDING ROADMAP</div>
        <h1>Unlock your personalized capital strategy.</h1>
        <p className="step-sub">
          Your Verdic™ score identified what&apos;s standing between you and
          capital. Your Funding Roadmap maps the exact path forward.
        </p>
      </div>

      {/* What's included */}
      <div className="membership-card">
        <div className="membership-card-header">
          <div className="membership-price">
            <span className="membership-amount">$350</span>
            <span className="membership-label">one-time</span>
          </div>
          <h2>Capital Architect Funding Roadmap</h2>
        </div>

        <ul className="membership-features">
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Personalized capital stack sequencing — which products to pursue and in what order
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Metro 2 dispute strategy with pre-built letter templates
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Lender-ready positioning — entity setup, EIN, D&B tradeline guidance
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Credit utilization optimization and inquiry management
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Full dashboard access with milestone tracking
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            90-day fundability improvement timeline
          </li>
        </ul>

        {isSignedIn ? (
          <div className="membership-cta-section">
            <p className="membership-greeting">
              Welcome back, {firstName}. Complete your purchase to unlock full
              dashboard access.
            </p>
            <a
              href={STRIPE_PAYMENT_LINK}
              className="btn-primary membership-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlock Your Funding Roadmap — $350
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="membership-cta-section">
            <p className="membership-greeting">
              Create your account first, then complete your purchase.
            </p>
            <SignInButton mode="modal">
              <button className="btn-primary membership-cta">
                Sign In to Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </SignInButton>
          </div>
        )}

        <p className="membership-fine">
          Secure payment via Stripe. One-time purchase — no subscriptions, no
          hidden fees.
        </p>
      </div>

      {/* Guarantee */}
      <div className="membership-guarantee">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <strong>What you get is permanent.</strong>
          <p>This isn&apos;t a subscription. You buy it once, it&apos;s yours.
          Your roadmap, your templates, your dashboard access — all retained.</p>
        </div>
      </div>
    </div>
  );
}
