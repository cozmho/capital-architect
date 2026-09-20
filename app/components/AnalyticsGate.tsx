"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

/**
 * AnalyticsGate — gates Vercel Analytics behind cookie consent (Phase 2).
 * Only renders the Analytics component after the user has granted consent
 * via the CookieConsent banner.
 */
export default function AnalyticsGate() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    try {
      setConsentGranted(localStorage.getItem("ca_cookie_consent") === "granted");
    } catch {
      // localStorage unavailable — do not load analytics
      setConsentGranted(false);
    }
  }, []);

  if (!consentGranted) return null;
  return <Analytics />;
}
