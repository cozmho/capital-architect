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

export default function PrepPage() {
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
      <div className="results-score-card tier-b">
        <div className="score-eyebrow">YOUR VERDIC™ SCORE</div>
        <div className="score-display">
          <span className="score-number tier-b-color">{data?.score ?? "—"}</span>
          <span className="score-out-of">/ 100</span>
        </div>
        <div className="score-tier-badge tier-b-badge">
          <span className="tier-letter">B</span>
          Tier B — Emerging
        </div>
      </div>

      {/* Diagnosis */}
      <div className="results-content">
        <h1>
          {firstName}, you&apos;ve got a solid foundation — with addressable gaps.
        </h1>
        <p className="results-body">
          You&apos;re not starting from zero, but there are specific issues standing
          between you and the capital terms you deserve. The good news: these are
          fixable, and most can be resolved in 60–90 days with the right strategy.
        </p>

        <ul className="results-list">
          <li>
            <div className="results-list-icon tier-b-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--green)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Credit optimization is your primary lever</strong> —
              resolving Metro 2 errors, reducing inquiry volume, and tradeline
              positioning will move you to Tier A.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-b-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--green)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Some capital products are available now</strong> — but at
              reduced terms. Your roadmap will identify which to pursue
              immediately and which to defer.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-b-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--green)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>An entity or infrastructure gap may exist</strong> — your
              business structure may need a minor correction to unlock premium
              lending products.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-b-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--green)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>60–90 day sprint to Tier A</strong> — with targeted credit
              architecture and dispute resolution, your path to full capital
              access is clear and achievable.
            </span>
          </li>
        </ul>

        {/* CTAs */}
        <div className="results-ctas">
          <a href="/dashboard/client/letter-preview" className="btn-outline-gold results-cta">
            Download Free Dispute Letter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
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
          Includes your personalized optimization sprint, dispute strategy,
          capital stack sequencing, and full dashboard access.
        </p>
      </div>
    </div>
  );
}
