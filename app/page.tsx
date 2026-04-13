import ScrollEffects from "@/components/ScrollEffects";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import NavClient from "@/components/NavClient";

/* ====================================================================
   Inline SVG helpers
   ==================================================================== */
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TriangleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon
        points="12,3 22,21 2,21"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="17"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ====================================================================
   PAGE COMPONENT
   ==================================================================== */
export default function HomePage() {
  return (
    <>
      <ScrollEffects />

      {/* ----------------------------------------------------------------
          SECTION 1 — NAV
      ---------------------------------------------------------------- */}
      <NavClient />

      {/* ----------------------------------------------------------------
          SECTION 2 — HERO
      ---------------------------------------------------------------- */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow reveal">
            INSTITUTIONAL-GRADE FUNDING STRATEGY
          </div>

          <h1 className="reveal reveal-delay-1">
            Business funding that fits <em>your</em> reality.
          </h1>

          <p className="hero-sub reveal reveal-delay-2">
            Automated fundability scoring. Expert credit architecture. Capital
            secured at terms that actually work for your business — not just the
            lender.
          </p>

          <div className="hero-actions reveal reveal-delay-3">
            <a href="/intake" className="btn-primary">
              Start Your Free Assessment
              <ArrowRight />
            </a>
            <a href="#services" className="btn-ghost">
              See How It Works
            </a>
          </div>

          <div className="hero-trust reveal reveal-delay-4">
            <span className="trust-item">
              <span className="trust-dot" />
              FCRA-Compliant
            </span>
            <span className="trust-item">
              <span className="trust-dot" />
              No-Fee Until Funded
            </span>
            <span className="trust-item">
              <span className="trust-dot" />
              Verdic™ Scoring
            </span>
            <span className="trust-item">
              <span className="trust-dot" />
              Metro 2 Dispute Strategy
            </span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 3 — STATS BAR
      ---------------------------------------------------------------- */}
      <div className="stats-bar">
        <div className="stats-bar-inner reveal">
          <div className="stat-item">
            <div className="stat-number">$497</div>
            <div className="stat-label">
              Fundability Audit — full diagnostic
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10%</div>
            <div className="stat-label">
              Success fee — only when you&apos;re funded
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0%</div>
            <div className="stat-label">
              Intro rate business credit available
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">
              Funding tiers matched to your Verdic score
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          SECTION 4 — PARTNER / VALUE PROP
      ---------------------------------------------------------------- */}
      <section className="partner" id="about">
        <div className="partner-left">
          <h2 className="reveal">
            You don&apos;t just need a lender.{" "}
            <strong style={{ color: "var(--gold)", fontWeight: 400 }}>
              You need a strategist.
            </strong>
          </h2>
          <p className="reveal reveal-delay-1">
            Most business owners walk into the capital markets speaking the
            wrong language. Lenders aren&apos;t your friends — they&apos;re
            decision engines running criteria you&apos;ve probably never seen.
            We teach you to speak their language before you ever submit an
            application.
          </p>
          <a
            href="/contact"
            className="btn-outline-gold reveal reveal-delay-2"
          >
            Book a Strategy Call
            <ArrowRight />
          </a>
        </div>

        <ul className="feature-list">
          <li className="feature-item reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="feature-text">
              <strong>Automated Verdic™ Scoring</strong>
              <span>
                Your fundability score calculated in minutes — Metro 2 errors,
                inquiry impact, entity structure and more.
              </span>
            </div>
          </li>
          <li className="feature-item reveal reveal-delay-1">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="16" y2="14" />
                <line x1="8" y1="18" x2="12" y2="18" />
              </svg>
            </div>
            <div className="feature-text">
              <strong>Institutional Credit Architecture</strong>
              <span>
                Clean FCRA dispute strategy, entity optimization, and tradeline
                positioning — done right, not just done fast.
              </span>
            </div>
          </li>
          <li className="feature-item reveal reveal-delay-2">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div className="feature-text">
              <strong>Three-Tier Capital Stack</strong>
              <span>
                0% business credit → unsecured lines → term loans and SBA.
                Sequenced for maximum leverage, minimum risk.
              </span>
            </div>
          </li>
          <li className="feature-item reveal reveal-delay-3">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="feature-text">
              <strong>Offense, Defense, or Hold the Line</strong>
              <span>
                Capital isn&apos;t just money — it&apos;s strategy. We tell you
                when to grow, when to protect, and when to wait.
              </span>
            </div>
          </li>
        </ul>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 5 — DIVIDER
      ---------------------------------------------------------------- */}
      <hr className="divider" />

      {/* ----------------------------------------------------------------
          SECTION 6 — SERVICES
      ---------------------------------------------------------------- */}
      <section className="services" id="services">
        <div className="section-header reveal">
          <div className="section-eyebrow">WHAT WE DO</div>
          <h2>
            Everything you need to access capital with confidence.
          </h2>
        </div>

        <div className="service-cards">
          <div className="card reveal">
            <span className="card-badge">Start Here · $497</span>
            <h3>Fundability Audit</h3>
            <p>
              Not sure if you&apos;re ready for capital? Your Verdic™ score
              tells you exactly where you stand — Metro 2 errors, entity gaps,
              inquiry damage, and everything lenders actually evaluate before
              saying yes.
            </p>
            <a href="/intake" className="card-link link-gold">
              Get Your Audit
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="card reveal reveal-delay-1">
            <span className="card-badge">Credit Architecture</span>
            <h3>Credit Optimization</h3>
            <p>
              Ready to repair the damage and build institutional-grade credit?
              FCRA-compliant dispute strategy, tradeline positioning, and entity
              structure — built for the funding application, not just a better
              number.
            </p>
            <a href="/assess" className="card-link link-gold">
              Learn How
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="card reveal reveal-delay-2">
            <span className="card-badge">Capital Strategy · 10% success fee</span>
            <h3>Funding Strategy</h3>
            <p>
              Get a true capital partner. From application positioning through
              lender routing and term negotiation — we don&apos;t take a fee
              until you&apos;re funded. Your win is the only win that counts.
            </p>
            <a href="/contact" className="card-link link-gold">
              Start the Conversation
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 7 — VERDIC
      ---------------------------------------------------------------- */}
      <section className="verdic" id="verdic">
        <div className="verdic-inner">
          <div className="verdic-grid">
            <div className="verdic-left">
              <div className="section-eyebrow reveal">THE VERDIC™ SYSTEM</div>
              <h2 className="reveal reveal-delay-1">
                Your fundability score — calculated like a lender would.
              </h2>
              <p className="reveal reveal-delay-2">
                Verdic starts at 100 and works like an underwriter, not a
                guesser. Metro 2 errors reduce your score. Inquiry volume hurts
                it. Your entity structure and credit profile either unlock doors
                or close them. We tell you exactly which — and exactly what to
                fix.
              </p>
              <a
                href="/intake"
                className="btn-primary reveal reveal-delay-3"
              >
                Run My Verdic Score
                <ArrowRight />
              </a>
            </div>

            <div className="tier-cards">
              <div className="tier-card reveal">
                <div
                  className="tier-badge"
                  style={{
                    background: "var(--gold-bg)",
                    color: "var(--gold)",
                  }}
                >
                  A
                </div>
                <div className="tier-info">
                  <div className="tier-label">Tier A — Capital Ready</div>
                  <div className="tier-desc">
                    Strong fundability profile. Prime access to business credit
                    lines, unsecured products, and term loans.
                  </div>
                </div>
                <div
                  className="tier-score"
                  style={{ color: "var(--gold)" }}
                >
                  ≥ 80
                </div>
              </div>

              <div className="tier-card reveal reveal-delay-1">
                <div
                  className="tier-badge"
                  style={{
                    background: "var(--green-bg)",
                    color: "var(--green)",
                  }}
                >
                  B
                </div>
                <div className="tier-info">
                  <div className="tier-label">Tier B — Emerging</div>
                  <div className="tier-desc">
                    Solid foundation with addressable gaps. Targeted credit
                    architecture unlocks the next tier in 60–90 days.
                  </div>
                </div>
                <div
                  className="tier-score"
                  style={{ color: "var(--green)" }}
                >
                  65 – 79
                </div>
              </div>

              <div className="tier-card reveal reveal-delay-2">
                <div
                  className="tier-badge"
                  style={{
                    background: "var(--red-bg)",
                    color: "var(--red)",
                  }}
                >
                  C
                </div>
                <div className="tier-info">
                  <div className="tier-label">Tier C — Rebuild First</div>
                  <div className="tier-desc">
                    Significant fundability barriers present. We map the exact
                    path to Tier B before any capital application.
                  </div>
                </div>
                <div
                  className="tier-score"
                  style={{ color: "var(--red)" }}
                >
                  &lt; 65
                </div>
              </div>

              <p className="verdic-footnote reveal reveal-delay-3">
                Verdic base score: 100 · Deductions: Metro 2 errors, inquiry
                volume · Bonuses: entity type, profile depth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 8 — PROCESS
      ---------------------------------------------------------------- */}
      <section className="process" id="process">
        <div className="section-header reveal">
          <div className="section-eyebrow">THE PROCESS</div>
          <h2>
            Three steps from where you are to where you need to be.
          </h2>
        </div>

        <div className="process-steps">
          <div className="step reveal">
            <div className="step-circle">1</div>
            <h3>Assess Your Fundability</h3>
            <p>
              Complete the three-step assessment. Verdic™ scores your credit
              profile exactly as a lender would — Metro 2 errors, inquiry count,
              entity structure. You&apos;ll know your tier in minutes.
            </p>
          </div>

          <div className="step reveal reveal-delay-1">
            <div className="step-circle">2</div>
            <h3>Architect the Foundation</h3>
            <p>
              Your roadmap is built from your score. Tier C gets a rebuild plan.
              Tier B gets an optimization sprint. Tier A gets routed to funding
              options matched to your business profile — no guesswork.
            </p>
          </div>

          <div className="step reveal reveal-delay-2">
            <div className="step-circle">3</div>
            <h3>Access the Capital</h3>
            <p>
              We position you as the borrower lenders want to approve — then we
              help you deploy that capital with discipline. The move depends on
              your business, not our commission.
            </p>
          </div>
        </div>

        <div className="process-cta reveal">
          <a href="/intake" className="btn-primary">
            Start Your Assessment
            <ArrowRight />
          </a>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 9 — RESULTS
      ---------------------------------------------------------------- */}
      <section className="results" id="results">
        <div className="section-header reveal">
          <div className="section-eyebrow">RESULTS</div>
          <h2>
            What business owners have accessed working with Capital Architect.
          </h2>
        </div>

        <div className="results-grid">
          <div className="result-card reveal">
            <div className="result-amount">$150K</div>
            <p className="result-desc">
              Unsecured business credit line secured for a Tier A LLC within 45
              days of audit completion.
            </p>
            <p className="result-tag">E-commerce · LLC · Tier A</p>
          </div>

          <div className="result-card reveal reveal-delay-1">
            <div className="result-amount">$75K</div>
            <p className="result-desc">
              0% introductory business credit unlocked after Metro 2 dispute
              resolution moved client from Tier C to Tier B.
            </p>
            <p className="result-tag">
              Service Business · Sole Prop → LLC
            </p>
          </div>

          <div className="result-card reveal reveal-delay-2">
            <div className="result-amount">$250K</div>
            <p className="result-desc">
              SBA-backed term loan positioned and approved after 90-day entity
              restructure and tradeline build.
            </p>
            <p className="result-tag">Contractor · S-Corp · Tier A</p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 10 — SOCIAL PROOF
      ---------------------------------------------------------------- */}
      <section className="social-proof">
        <div className="social-proof-inner reveal">
          <div className="proof-item">
            <p className="proof-quote">
              &ldquo;Finally, a system that speaks lender language.&rdquo;
            </p>
            <p className="proof-attr">E-commerce founder, Chicago</p>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <p className="proof-quote">
              &ldquo;Went from Tier C to Tier A in 11 weeks. $75K line
              approved.&rdquo;
            </p>
            <p className="proof-attr">Service business, Atlanta</p>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <p className="proof-quote">
              &ldquo;The Verdic audit showed me exactly what was killing my
              applications.&rdquo;
            </p>
            <p className="proof-attr">Contractor, Houston</p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 11 — CTA BANNER
      ---------------------------------------------------------------- */}
      <section className="cta-banner">
        <div className="cta-banner-inner reveal">
          <div className="section-eyebrow">READY TO TALK STRATEGY?</div>
          <h2>Not sure where to start? That&apos;s what we&apos;re for.</h2>
          <p>
            Book a free 20-minute strategy call. We&apos;ll tell you your tier,
            what&apos;s blocking your capital access, and exactly what to do
            first.
          </p>
          <div className="cta-banner-actions">
            <a href="/contact" className="btn-primary">
              Book a Strategy Call
              <ArrowRight />
            </a>
            <a href="/intake" className="btn-ghost">
              Take the Assessment First
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 12 — LEAD MAGNET / BLUEPRINT
      ---------------------------------------------------------------- */}
      <section className="magnet" id="resources">
        <div className="magnet-inner">
          <div className="magnet-left">
            <div className="section-eyebrow reveal">FREE RESOURCE</div>
            <h2 className="reveal reveal-delay-1">
              Download the Free Fundability Blueprint
            </h2>
            <ul className="checklist reveal reveal-delay-2">
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Understand exactly how lenders score your credit profile
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Learn what Metro 2 errors are — and how to eliminate them
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Discover the three-tier capital stack and where you fit
              </li>
              <li>
                <span className="check-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                See the entity structures that unlock premium lending products
              </li>
            </ul>
          </div>

          <div className="reveal reveal-delay-3">
            <LeadMagnetForm />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SECTION 13 — FOOTER
      ---------------------------------------------------------------- */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/" className="nav-logo">
                <div className="nav-logo-mark">
                  <TriangleLogo />
                </div>
                <span className="nav-brand">Capital Architect</span>
              </a>
              <p className="footer-tagline">
                Institutional-grade funding strategy for business owners who are
                done leaving money on the table.
              </p>
              <div className="footer-brand-links">
                <a href="/intake" className="btn-outline-gold">
                  Get Your Verdic™ Score
                  <ArrowRight />
                </a>
                <a href="/contact" className="link-gold">
                  Book a Strategy Call
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="/intake">Fundability Audit</a>
                </li>
                <li>
                  <a href="/assess">Credit Optimization</a>
                </li>
                <li>
                  <a href="/contact">Funding Strategy</a>
                </li>
                <li>
                  <a href="/intake">Verdic™ Score</a>
                </li>
                <li>
                  <a href="/membership">Membership</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#resources">Free Blueprint</a>
                </li>
                <li>
                  <a href="#verdic">How Verdic Works</a>
                </li>
                <li>
                  <a href="#results">Client Results</a>
                </li>
                <li>
                  <a href="#process">The Process</a>
                </li>
                <li>
                  <a href="/dashboard">Your Dashboard</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Capital Architect LLC. All rights reserved.</span>
            <span>capitalarchitect.tech</span>
          </div>
        </div>
      </footer>

      {/* ----------------------------------------------------------------
          SECTION 14 — STICKY MOBILE CTA BAR
      ---------------------------------------------------------------- */}
      <div className="mobile-cta-bar">
        <a
          href="/contact"
          className="btn-ghost"
          style={{ flex: 1, justifyContent: "center" }}
        >
          Contact Us
        </a>
        <a
          href="/intake"
          className="btn-primary"
          style={{ flex: 2, justifyContent: "center" }}
        >
          Get Your Verdic Score
        </a>
      </div>
    </>
  );
}
