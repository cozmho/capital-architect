import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from '@clerk/nextjs'

export default function Nav() {
  return (
    <nav>
      <div className="nav-logo">
        <div className="nav-logo-mark">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20l9-16 9 16H3z" stroke="#C8A84B" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M7.5 20l4.5-8 4.5 8" stroke="#C8A84B" strokeWidth="1" fill="none" strokeLinejoin="round" opacity="0.5" />
          </svg>
        </div>
        <span className="nav-brand">Capital Architect</span>
      </div>
      <ul className="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#verdic">How It Works</a></li>
        <li><a href="#results">Results</a></li>
        <li><a href="#resources">Resources</a></li>
        <Show when="signed-out">
          <li>
            <SignInButton mode="redirect" fallbackRedirectUrl="/">
              <a href="#" style={{ color: 'var(--muted)', fontSize: '14px' }}>Sign In</a>
            </SignInButton>
          </li>
          <li>
            <SignUpButton mode="redirect" fallbackRedirectUrl="/">
              <a href="#" className="nav-cta">Get Your Verdic Score</a>
            </SignUpButton>
          </li>
        </Show>
        <Show when="signed-in">
          <li><a href="/dashboard/client" style={{ color: 'var(--muted)', fontSize: '14px' }}>Dashboard</a></li>
          <li><UserButton /></li>
          <li><a href="/assess" className="nav-cta">Get Your Score</a></li>
        </Show>
      </ul>
    </nav>
  );
}
