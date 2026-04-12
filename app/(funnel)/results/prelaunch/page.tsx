"use client";

import { useEffect, useState } from "react";

const STRIPE_URL = "https://buy.stripe.com/00wdR8h1F0rT8wCdvLaVa00";

interface VerdicData {
  score: number;
  tier: string;
  hasMetro2Errors: boolean;
  fullName: string;
  path: string;
}

export default function PrelaunchPage() {
  const [data, setData] = useState<VerdicData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("verdicResult");
    if (stored) setData(JSON.parse(stored));
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
          Pre-Launch — Build the Foundation
        </div>
      </div>

      {/* Diagnosis */}
      <div className="results-content">
        <h1>
          {firstName}, build the foundation before the bank conversation.
        </h1>
        <p className="results-body">
          You&apos;re earlier in the journey than most people who come to us — and
          that&apos;s actually an advantage. Most business owners apply for capital
          with a broken foundation and burn inquiries, time, and leverage in the
          process. You have the chance to do it right from the start.
        </p>

        <ul className="results-list">
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Your personal credit profile needs repair first</strong>
              — lenders evaluate personal credit before anything else, even for
              business products. Fix the foundation before building on it.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Entity formation is essential</strong> — without an LLC or
              S-Corp, an EIN, and a business bank account, you can&apos;t even
              begin to build business credit. These are your first moves.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Metro 2 errors may be suppressing your scores</strong> —
              disputing inaccurate reporting is free and often the fastest lever
              you have available right now.
            </span>
          </li>
          <li>
            <div className="results-list-icon tier-c-bg">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--red)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span>
              <strong>Your roadmap covers the entire pre-launch sequence</strong>
              — from credit repair to entity setup to your first business credit
              applications. Every step in order, nothing skipped.
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
            <strong>Starting early is an advantage, not a setback.</strong>
            <p>
              Most people who score Tier A didn&apos;t start there — they built
              it strategically. Your roadmap is a 90–120 day blueprint from
              where you are to where you need to be, with every milestone mapped.
            </p>
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
          Includes your complete pre-launch roadmap, personal credit repair
          strategy, entity formation guide, first business credit applications,
          and full dashboard access.
        </p>
      </div>
    </div>
  );
}
