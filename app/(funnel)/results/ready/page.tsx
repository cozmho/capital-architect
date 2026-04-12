"use client";

import { useEffect, useState } from "react";

const STRIPE_URL = "https://buy.stripe.com/00wdR8h1F0rT8wCdvLaVa00";

interface VerdicData {
  score: number;
  tier: string;
  hasMetro2Errors: boolean;
  fullName: string;
  businessName: string;
}

export default function ReadyPage() {
  const [data, setData] = useState<VerdicData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("verdicResult");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const firstName = data?.fullName?.split(" ")[0] || "there";

  return (
    <div className="results-container">
      {/* Score Display */}
      <div className="results-score-card tier-a">
        <div className="score-eyebrow">YOUR VERDIC™ SCORE</div>
        <div className="score-display">
          <span className="score-number tier-a-color">{data?.score ?? "—"}</span>
          <span className="score-out-of">/ 100</span>
        </div>
        <div className="score-tier-badge tier-a-badge">
          <span className="tier-letter">A</span>
          Tier A — Capital Ready
        </div>
      </div>

      {/* Diagnosis */}
      <div className="results-content">
        <h1>
          {firstName}, you&apos;re in a strong position.
        </h1>
        <p className="results-body">
          Your fundability profile indicates you&apos;re ready to access capital.
          Your credit posture, entity structure, and business profile are aligned
          with what lenders want to see. Here&apos;s what that means:
        </p>

        <ul className="results-list">
          <li>
            <div className="results-list-icon tier-a-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gold)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>
              <strong>Prime access to 0% introductory business credit lines</strong>
              — the first tier of your capital stack is unlocked.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-a-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gold)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>
              <strong>Unsecured business credit and term loans</strong> are
              within reach — your profile passes the initial screens.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-a-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gold)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>
              <strong>SBA-backed financing is on the table</strong> depending on
              revenue, time in business, and the specific product you need.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-a-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gold)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>
              <strong>Your Funding Roadmap</strong> will map the exact order of
              operations — which products to pursue, in what sequence, and how
              to maximize your total capital deployment.
            </span>
          </li>
        </ul>

        {/* Conditional Metro 2 warning */}
        {data?.hasMetro2Errors && (
          <div className="results-warning">
            <div className="results-warning-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <strong>Metro 2 Errors Detected</strong>
              <p>Even at Tier A, Metro 2 reporting errors can reduce your approved limits and cost you leverage. Your roadmap includes a targeted dispute strategy.</p>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="results-ctas">
          {data?.hasMetro2Errors && (
            <a href="/dashboard/client/letter-preview" className="btn-outline-gold results-cta">
              Download Free Dispute Letter
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </a>
          )}
          <a
            href={STRIPE_URL}
            className="btn-primary results-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unlock Your Funding Roadmap — $350
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <p className="results-fine">
          Includes your personalized funding roadmap, capital stack sequencing,
          lender-ready positioning, and full dashboard access.
        </p>
      </div>
    </div>
  );
}
