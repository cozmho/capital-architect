"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import DownloadReportButton from "@/app/_components/DownloadReportButton";

const contactEmail =
  process.env.NEXT_PUBLIC_MEMBERSHIP_CONTACT_EMAIL || "support@capitalarchitect.tech";

const prepCheckoutUrl =
  process.env.NEXT_PUBLIC_TIER_B_STRIPE_URL ||
  process.env.NEXT_PUBLIC_MEMBERSHIP_CHECKOUT_URL ||
  `mailto:${contactEmail}?subject=Capital%20Architect%20Funding%20Readiness%20Intensive`;

interface VerdicData {
  score: number;
  tier: string;
  fullName: string;
  leadId?: string;
  email?: string;
}

export default function PrepPage() {
  const [data] = useState<VerdicData | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("verdicResult");
    return stored ? JSON.parse(stored) : null;
  });

  const firstName = data?.fullName?.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-16 text-zinc-100">
      <div id="report-pdf" className="mx-auto max-w-3xl text-center">
        {/* Verdic Score Card */}
        {data?.score != null && (
          <div className="results-score-card tier-b" style={{ marginBottom: 32 }}>
            <div className="score-eyebrow">YOUR VERDIC™ SCORE</div>
            <div className="score-display">
              <span className="score-number tier-b-color">{data.score}</span>
              <span className="score-out-of">/ 100</span>
            </div>
            <div className="score-tier-badge tier-b-badge">
              <span className="tier-letter">B</span>
              Emerging — Almost There
            </div>
          </div>
        )}

        {!data?.score && (
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-yellow-500/20 p-6">
              <TrendingUp className="h-16 w-16 text-yellow-500" />
            </div>
          </div>
        )}

        <h1 className="font-serif text-5xl font-bold text-white md:text-6xl">
          {firstName ? `${firstName}, you're close.` : "You're Close."}
        </h1>
        <p className="mt-4 text-2xl font-light text-yellow-500">
          One sprint away from capital.
        </p>

        <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-8">
          <p className="text-lg text-zinc-300">
            Your fundability is within reach. A few structural fixes and you&apos;re in Tier A territory.
          </p>
          <p className="mt-4 text-zinc-400">
            Our Funding Readiness Intensive handles entity setup, credit positioning, and underwriting prep in one focused engagement.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href={prepCheckoutUrl}
            target="_blank"
            className="inline-block w-full rounded-lg bg-yellow-500 px-8 py-5 text-lg font-semibold text-[#060A14] transition hover:bg-yellow-400"
          >
            Start Your Funding Readiness Intensive — $1,500
          </Link>
          <p className="text-sm text-zinc-500">
            14-day program • Entity + Credit + Documentation • Tier A guarantee
          </p>
        </div>

        <div className="mt-16 space-y-6 text-left">
          <h2 className="font-serif text-2xl font-semibold text-white">What You Get:</h2>
          <div className="space-y-4">
            {[
              "Business entity formation or optimization",
              "Credit report cleanup and positioning",
              "Lender-ready documentation package",
              "Direct access to underwriting team",
              "Tier A re-assessment upon completion",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <p className="text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DownloadReportButton fileName="Capital-Architect-TierB-Report.pdf" targetId="report-pdf" />
    </main>
  );
}
