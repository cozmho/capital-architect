export default function VerdicSection() {
  return (
    <section className="verdic" id="verdic">
      <div className="verdic-inner">
        <div className="verdic-grid">
          <div className="verdic-left">
            <div className="section-eyebrow">The Verdic™ System</div>
            <h2 style={{fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em', marginTop: 16}}>
              Your fundability score — calculated like a lender would.
            </h2>
            <p>Verdic starts at 100 and works like an underwriter, not a guesser. Metro 2 errors reduce your score. Inquiry volume hurts it. Your entity structure and credit profile either unlock doors or close them. We tell you exactly which — and exactly what to fix.</p>
            <a href="/assess" className="btn-primary" style={{marginTop: 36, display: 'inline-flex', alignItems: 'center', gap: 8}}>
              Run My Verdic Score
              <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10M9 4l4 4-4 4" stroke="#060A14" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="verdic-right">
            <div className="tier-card">
              <div className="tier-badge tier-a">A</div>
              <div className="tier-info">
                <strong>Tier A — Capital Ready</strong>
                <span>Strong fundability profile. Prime access to business credit lines, unsecured products, and term loans.</span>
              </div>
              <div className="tier-score">≥ 80</div>
            </div>
            <div className="tier-card">
              <div className="tier-badge tier-b">B</div>
              <div className="tier-info">
                <strong>Tier B — Emerging</strong>
                <span>Solid foundation with addressable gaps. Targeted credit architecture unlocks the next tier in 60–90 days.</span>
              </div>
              <div className="tier-score">65 – 79</div>
            </div>
            <div className="tier-card">
              <div className="tier-badge tier-c">C</div>
              <div className="tier-info">
                <strong>Tier C — Rebuild First</strong>
                <span>Significant fundability barriers present. We map the exact path to Tier B before any capital application.</span>
              </div>
              <div className="tier-score">&lt; 65</div>
            </div>
            <p style={{fontSize: 13, color: 'var(--muted)', marginTop: 8, fontWeight: 300}}>
              Verdic base score: 100 · Deductions: Metro 2 errors, inquiry volume · Bonuses: entity type, profile depth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
