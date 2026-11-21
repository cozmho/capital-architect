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

export default function PrepPage() {
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
              <strong>60–90 day projected sprint to Tier A</strong> — with targeted credit
              architecture and dispute resolution, your path to full capital
              access is clear and achievable.
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
                    <h3 className="product-name">Funding Readiness Intensive</h3>
                    <p className="product-price">$1,500</p>
                    <p className="product-description">14-day program: entity setup, credit positioning, and underwriting prep</p>
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="productType" value="intensive" />
                      <input type="hidden" name="tier" value={data?.tier} />
                      <input type="hidden" name="email" value={data?.email} />
                      <input type="hidden" name="leadId" value={data?.leadId} />
                      <button type="submit" className="btn-primary product-btn">
                        Unlock — $1,500
                      </button>
                    </form>
                  </div>
                </div>

                <p className="results-fine">
                  Payment includes your personalized optimization sprint, dispute strategy, capital stack
                  sequencing, and full dashboard access. 3-day refund guarantee.
                </p>
      </div>
      <p className="results-disclaimer">
        Verdic™ is an educational fundability assessment, not a credit report or a guarantee of
        approval. Capital products, terms, and timelines vary by lender, business profile, and
        market conditions. Past outcomes shown are representative examples, not promises of
        specific results. You are never required to purchase any service to exercise your credit
        rights.
      </p>
    </div>
  );
}
