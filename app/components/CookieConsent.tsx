"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "ca_cookie_consent";
const COOKIE_POLICY_URL = "/cookies";

type ConsentState = "pending" | "granted" | "denied";

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [visible, setVisible] = useState(true);

  // Read stored consent on mount — hide banner if already decided
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "granted" || stored === "denied") {
        setConsent(stored);
        setVisible(false);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — show banner
    }
  }, []);

  const handleSetConsent = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore — consent may not be saveable (private mode, etc.)
    }
    setConsent(value);
    setVisible(false);
  };

  if (consent !== "pending" || !visible) return null;

  return (
    <div
      className="cookie-consent-bar"
      role="region"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          We use cookies to improve your experience and analyze site traffic.{" "}
          <Link href={COOKIE_POLICY_URL} className="cookie-consent-link">
            Read our Cookies Policy
          </Link>
        </p>
        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={() => handleSetConsent("granted")}
            aria-label="Accept all cookies"
          >
            Accept
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-deny"
            onClick={() => handleSetConsent("denied")}
            aria-label="Reject non-essential cookies"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
