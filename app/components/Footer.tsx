import Link from "next/link";

export default function Footer() {
  const businessDetails = {
    name: "Capital Architect",
    address: "Madison, WI",
    email: "hello@capitalarchitect.tech",
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo" style={{ marginBottom: 14 }}>
              <div className="nav-logo-mark">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 20l9-16 9 16H3z" stroke="#C8A84B" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  <path d="M7.5 20l4.5-8 4.5 8" stroke="#C8A84B" strokeWidth="1" fill="none" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
              <span className="nav-brand">Capital Architect</span>
            </div>
            <p>Institutional-grade funding strategy for business owners who are done leaving money on the table.</p>
            <a href="/assess" className="footer-assess-btn" style={{ marginTop: 20 }}>
              Get Your Verdic™ Score
              <svg viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="#C8A84B" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/assess">Fundability Audit</Link></li>
              <li><Link href="/assess">Credit Optimization</Link></li>
              <li><Link href="/assess">Funding Strategy</Link></li>
              <li><Link href="/assess">Verdic™ Score</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#resources">Free Blueprint</a></li>
              <li><a href="#verdic">How Verdic Works</a></li>
              <li><a href="#results">Client Results</a></li>
              <li><a href="#process">The Process</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link href="/cookies">Cookies Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {businessDetails.name}. All rights reserved.</span>
          <span>{businessDetails.address} · {businessDetails.email}</span>
        </div>
      </div>
    </footer>
  );
}
