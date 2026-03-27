"use client";

import { ReactNode } from "react";

type Props = {
  href: string;
  eventName: "membership_checkout_click" | "membership_call_click" | "membership_contact_click";
  className: string;
  children: ReactNode;
  target?: "_blank";
  rel?: string;
};

type DataLayerEvent = {
  event: string;
  destination: string;
  channel: string;
};

type TrackWindow = Window & {
  dataLayer?: DataLayerEvent[];
  gtag?: (command: string, eventName: string, params?: Record<string, string>) => void;
};

function trackMembershipClick(eventName: Props["eventName"], href: string) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    destination: href,
    channel: "membership",
  };

  const trackWindow = window as TrackWindow;
  trackWindow.dataLayer?.push(eventPayload);

  if (typeof trackWindow.gtag === "function") {
    trackWindow.gtag("event", eventName, {
      destination: href,
      channel: "membership",
    });
  }
}

export function TrackedExternalLink({ href, eventName, className, children, target, rel }: Props) {
  function handleClick() {
    trackMembershipClick(eventName, href);
  }

  return (
    <a href={href} target={target} rel={rel} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
