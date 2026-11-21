"use client";

import { useEffect, useState } from "react";

interface VerdicData {
  score: number;
  tier: string;
  hasMetro2Errors: boolean;
  fullName: string;
  path: string;
  email: string;
  leadId?: string;
}

export default function PrelaunchPage() {
  const [data, setData] = useState<VerdicData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("verdicResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge cookie-based leadId if sessionStorage lacks one (survives refresh)
      const cookieLeadId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("leadId="))
        ?.split("=")[1];
      if (cookieLeadId && !parsed.leadId) {
        parsed.leadId = cookieLeadId;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(parsed);
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

        {/* CTAs - Product Cards */}
        <div className="results-products">
          <div className="product-card">
            <h3 className="product-name">Fundability Audit</h3>
            <p className="product-price">$497</p>
            <p className="product-description">Exact lender order map so you don't burn inquiries on wrong applications</p>
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="productType" value="audit" />
              <input type="hidden" name="tier" value={data?.tier} />
              <input type="hidden" name="email" value={data?.email} />
              <input type="hidden" name="leadId" value={data?.leadId} />
              <button type="submit" className="btn-primary product-btn">
                Unlock — $497
              </button>
            </form>
          </div>
          <div className="product-card">
            <h3 className="product-name">Funding Roadmap</h3>
            <p className="product-price">$350</p>
            <p className="product-description">Complete pre-launch roadmap, personal credit repair strategy, entity formation guide, and dashboard access</p>
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="productType" value="roadmap" />
              <input type="hidden" name="tier" value={data?.tier} />
              <input type="hidden" name="email" value={data?.email} />
              <input type="hidden" name="leadId" value={data?.leadId} />
              <button type="submit" className="btn-primary product-btn">
                Unlock — $350
              </button>
            </form>
          </div>
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
