"use client";

import { useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/capitalarchitect-support";

export default function ContactPage() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="contact-container">
      <div className="contact-header">
        <div className="section-eyebrow">STRATEGY CALL</div>
        <h1>Talk to a funding strategist.</h1>
        <p className="step-sub">
          Book a free 15-minute call. We&apos;ll review your Verdic™ score, answer
          your questions, and map the fastest path to capital.
        </p>
      </div>

      <div className="contact-features">
        <div className="contact-feature">
          <div className="contact-feature-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <strong>15 minutes, zero pressure</strong>
            <span>Quick, focused conversation about your capital position.</span>
          </div>
        </div>
        <div className="contact-feature">
          <div className="contact-feature-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <strong>No credit pulls, no commitments</strong>
            <span>We assess your situation — you decide what&apos;s next.</span>
          </div>
        </div>
        <div className="contact-feature">
          <div className="contact-feature-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <strong>Come with your Verdic score</strong>
            <span>Already took the assessment? We&apos;ll reference your results live.</span>
          </div>
        </div>
      </div>

      {/* Calendly Embed */}
      <div className="contact-calendly">
        <div
          className="calendly-inline-widget"
          data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0c1220&text_color=f0ede6&primary_color=c8a84b`}
          style={{ minWidth: "320px", height: "700px", width: "100%" }}
        />
      </div>

      {/* Alternate contact */}
      <div className="contact-alt">
        <p>Prefer email? Reach us at <a href="mailto:support@capitalarchitect.tech">support@capitalarchitect.tech</a></p>
      </div>
    </div>
  );
}
