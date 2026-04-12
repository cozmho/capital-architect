import Link from "next/link";

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
      <line x1="12" y1="9" x2="12" y2="17" stroke="var(--gold)" strokeWidth="1.5" />
    </svg>
  );
}

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <TriangleLogo />
          </div>
          <span className="nav-brand">Capital Architect</span>
        </Link>
        <div className="nav-right-minimal">
          <Link href="/" className="nav-back-link">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <Link href="/contact" className="btn-nav-cta">
            Talk to a Strategist
          </Link>
        </div>
      </nav>

      <main className="intake-main">{children}</main>

      <footer className="footer-minimal">
        <div className="footer-minimal-inner">
          <span>© 2025 Capital Architect LLC. All rights reserved.</span>
          <span>capitalarchitect.tech</span>
        </div>
      </footer>
    </>
  );
}
