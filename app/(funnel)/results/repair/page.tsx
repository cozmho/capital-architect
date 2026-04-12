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

export default function RepairPage() {
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
      <div className="results-score-card tier-c">
        <div className="score-eyebrow">YOUR VERDIC™ SCORE</div>
        <div className="score-display">
          <span className="score-number tier-c-color">{data?.score ?? "—"}</span>
          <span className="score-out-of">/ 100</span>
        </div>
        <div className="score-tier-badge tier-c-badge">
          <span className="tier-letter">C</span>
          Tier C — Rebuild First
        </div>
      </div>

      {/* Diagnosis */}
      <div className="results-content">
        <h1>
          {firstName}, here&apos;s what&apos;s blocking your capital access.
        </h1>
        <p className="results-body">
          Your fundability profile has significant barriers that will result in
          denied applications, unfavorable terms, or both. Applying now would
          cost you time, inquiries, and leverage. But every issue we identified
          has a path to resolution.
        </p>

        <ul className="results-list">
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span>
              <strong>Credit deficiencies need repair before applications</strong>
              — submitting prematurely burns inquiries and shrinks your window.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span>
              <strong>Metro 2 errors and/or derogatory marks</strong> are likely
              suppressing your scores and limiting every product available to you.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span>
              <strong>Entity and infrastructure gaps compound the problem</strong>
              — without the right structure, even improved credit won&apos;t
              unlock premium lending products.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span>
              <strong>Your roadmap maps the exact path to Tier B</strong> — a
              full rebuild plan with dispute sequencing, entity setup, and
              milestone targets to get you fundable.
            </span>
          </li>
        </ul>

        {/* Reassurance block */}
        <div className="results-reassurance">
          <div className="results-reassurance-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <strong>This is a starting point, not a verdict.</strong>
            <p>Most Tier C clients reach Tier B within 90–120 days with structured credit architecture. The path exists — your roadmap shows you every step.</p>
          </div>
        </div>

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
          Includes your complete rebuild roadmap, Metro 2 dispute strategy,
          entity setup guide, milestone timeline, and full dashboard access.
        </p>
      </div>
    </div>
  );
}
