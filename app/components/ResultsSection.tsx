export default function ResultsSection() {
  return (
    <section className="results" id="results">
      <div className="section-header">
        <div className="section-eyebrow">Results</div>
        <h2>What business owners have accessed working with Capital Architect.</h2>
      </div>
      <div className="results-grid">
        <div className="result-card">
          <div className="result-amount">$150K</div>
          <div className="result-desc">Unsecured business credit line secured for a Tier A LLC within 45 days of audit completion.</div>
          <div className="result-entity">E-commerce · LLC · Tier A</div>
        </div>
        <div className="result-card">
          <div className="result-amount">$75K</div>
          <div className="result-desc">0% introductory business credit unlocked after Metro 2 dispute resolution moved client from Tier C to Tier B.</div>
          <div className="result-entity">Service Business · Sole Prop → LLC</div>
        </div>
        <div className="result-card">
          <div className="result-amount">$250K</div>
          <div className="result-desc">SBA-backed term loan positioned and approved after 90-day entity restructure and tradeline build.</div>
          <div className="result-entity">Contractor · S-Corp · Tier A</div>
        </div>
      </div>
    </section>
  );
}
