"use client";

import { useEffect, useState } from "react";

interface VerdicData {
  score: number;
  tier: string;
  hasMetro2Errors: boolean;
  fullName: string;
  businessName: string;
  email: string;
  leadId?: string;
}

export default function RepairPage() {
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
            <p className="product-description">Complete rebuild roadmap with Metro 2 dispute strategy, entity setup, and dashboard access</p>
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
          Includes your complete rebuild roadmap, Metro 2 dispute strategy,
          entity setup guide, milestone timeline, and full dashboard access.
        </p>
      </div>
    </div>
  );
}
