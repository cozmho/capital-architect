export default function Services() {
  return (
    <section className="services" id="services">
      <div className="section-header">
        <div className="section-eyebrow">What We Do</div>
        <h2>Everything you need to access capital with confidence.</h2>
      </div>
      <div className="service-cards">
        <div className="card">
          <div className="card-badge">Start Here · $497</div>
          <h3>Fundability Audit</h3>
          <p>Not sure if you're ready for capital? Your Verdic™ score tells you exactly where you stand — Metro 2 errors, entity gaps, inquiry damage, and everything lenders actually look at.</p>
          <a href="/assess" className="card-link">
            Get Your Audit
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
        <div className="card">
          <div className="card-badge">Credit Architecture</div>
          <h3>Credit Optimization</h3>
          <p>Ready to repair the damage and build institutional-grade credit? FCRA-compliant dispute strategy, tradeline positioning, and entity structure — built for the funding application, not just a better score.</p>
          <a href="/assess" className="card-link">
            Learn How
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
        <div className="card">
          <div className="card-badge">Capital Strategy · 10% success fee</div>
          <h3>Funding Strategy</h3>
          <p>Get a true capital partner. From application positioning through lender routing and term negotiation — we don't take a fee until you're funded. Your win is the only win that counts.</p>
          <a href="/assess" className="card-link">
            Start the Conversation
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
