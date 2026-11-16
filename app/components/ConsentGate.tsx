"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "ca_cookie_consent";

/**
 * ConsentGate — wraps any non-essential third-party embed and only renders
 * its children after the user has granted cookie consent via the
 * CookieConsent banner.
 *
 * Usage:
 *   <ConsentGate>
 *     <CalendlyWidget />
 *     <SomeOtherEmbed />
 *   </ConsentGate>
 */
export default function ConsentGate({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    try {
      setConsentGranted(localStorage.getItem(CONSENT_KEY) === "granted");
    } catch {
      // localStorage unavailable — do not render gated content
      setConsentGranted(false);
    }
  }, []);

  if (!consentGranted) return fallback;
  return <>{children}</>;
}
