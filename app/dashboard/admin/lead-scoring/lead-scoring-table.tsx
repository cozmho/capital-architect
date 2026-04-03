"use client";

import { Bot, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

type LeadRow = {
  id: string;
  businessName: string | null;
  ownerName: string | null;
  email: string | null;
  fundabilityScore: number | null;
  entityType: string | null;
  metro2ErrorCount: number | null;
  recentInquiries: number | null;
  complianceStatus: string | null;
  createdAt: string;
};

type StrategyState = {
  status: "idle" | "loading" | "ready" | "error";
  strategy?: string;
  source?: "ai" | "deterministic";
  error?: string;
};

type Props = {
  leads: LeadRow[];
  tierCounts: {
    A: number;
    B: number;
    C: number;
  };
};

type VerdictTier = "A" | "B" | "C" | "UNSCORED";

function computeTier(score: number | null): VerdictTier {
  if (score === null || score === undefined) return "UNSCORED";
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  return "C";
}

function getTierBadgeClass(tier: VerdictTier): string {
  switch (tier) {
    case "A":
      return "bg-[#C8A84B]/20 text-[#C8A84B] border-[#C8A84B]/40";
    case "B":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
    case "C":
      return "bg-red-500/20 text-red-300 border-red-500/40";
    default:
      return "bg-zinc-700/20 text-zinc-400 border-zinc-700/40";
  }
}

function getTierLabel(tier: VerdictTier): string {
  switch (tier) {
    case "A":
      return "Ready for Funding";
    case "B":
      return "Needs Entity Work";
    case "C":
      return "Credit Repair First";
    default:
      return "Not Scored";
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LeadScoringTable({ leads, tierCounts }: Props) {
  const [strategyState, setStrategyState] = useState<Record<string, StrategyState>>({});

  async function handleGenerateStrategy(leadId: string) {
    setStrategyState((current) => ({
      ...current,
      [leadId]: { status: "loading" },
    }));

    try {
      const response = await fetch(`/api/leads/${leadId}/strategy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = (await response.json()) as {
        strategy?: string;
        source?: "ai" | "deterministic";
        error?: string;
      };

      if (!response.ok || !payload.strategy) {
        throw new Error(payload.error ?? "Failed to generate strategy");
      }

      setStrategyState((current) => ({
        ...current,
        [leadId]: {
          status: "ready",
          strategy: payload.strategy,
          source: payload.source,
        },
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate strategy";
      setStrategyState((current) => ({
        ...current,
        [leadId]: {
          status: "error",
          error: message,
        },
      }));
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">God-Mode Dashboard</h1>
              <p className="mt-2 text-sm text-zinc-400">Fundability scoring, tier routing, and on-demand deal strategy for active leads.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A84B]/30 bg-[#C8A84B]/10 px-4 py-2 text-sm text-[#C8A84B]">
              <Sparkles className="h-4 w-4" />
              Leads Intelligence View
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#C8A84B]/40 bg-[#C8A84B]/10 p-6">
            <p className="text-sm text-zinc-400">Tier A</p>
            <p className="mt-2 text-3xl font-bold text-[#C8A84B]">{tierCounts.A}</p>
            <p className="mt-1 text-xs text-zinc-500">Ready for Funding</p>
          </div>
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-6">
            <p className="text-sm text-zinc-400">Tier B</p>
            <p className="mt-2 text-3xl font-bold text-yellow-300">{tierCounts.B}</p>
            <p className="mt-1 text-xs text-zinc-500">Needs Entity Work</p>
          </div>
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
            <p className="text-sm text-zinc-400">Tier C</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{tierCounts.C}</p>
            <p className="mt-1 text-xs text-zinc-500">Credit Repair First</p>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-6 py-4 font-medium">Name / Email</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Tier</th>
                  <th className="px-6 py-4 font-medium">Entity Type</th>
                  <th className="px-6 py-4 font-medium">Metro 2 Errors</th>
                  <th className="px-6 py-4 font-medium">Inquiries</th>
                  <th className="px-6 py-4 font-medium">Deal Strategy</th>
                  <th className="px-6 py-4 font-medium">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leads.length ? (
                  leads.map((lead) => {
                    const tier = computeTier(lead.fundabilityScore);
                    const currentStrategy = strategyState[lead.id];

                    return (
                      <tr key={lead.id} className="border-b border-zinc-800/50 transition hover:bg-zinc-800/30">
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm">
                            <p className="font-medium text-zinc-200">{lead.businessName || lead.ownerName || "Unknown"}</p>
                            {lead.email ? <p className="text-xs text-zinc-500">{lead.email}</p> : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="text-lg font-semibold text-white">{lead.fundabilityScore ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getTierBadgeClass(tier)}`}
                          >
                            {tier} · {getTierLabel(tier)}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-zinc-400">{lead.entityType || "—"}</td>
                        <td className="px-6 py-4 align-top text-center text-sm text-zinc-400">{lead.metro2ErrorCount ?? "—"}</td>
                        <td className="px-6 py-4 align-top text-center text-sm text-zinc-400">{lead.recentInquiries ?? "—"}</td>
                        <td className="px-6 py-4 align-top">
                          <div className="max-w-xl space-y-3">
                            <button
                              type="button"
                              onClick={() => handleGenerateStrategy(lead.id)}
                              disabled={currentStrategy?.status === "loading"}
                              className="inline-flex items-center gap-2 rounded-full border border-[#C8A84B]/40 bg-[#C8A84B]/10 px-3 py-1.5 text-xs font-semibold text-[#C8A84B] transition hover:bg-[#C8A84B]/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {currentStrategy?.status === "loading" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Bot className="h-3.5 w-3.5" />
                              )}
                              {currentStrategy?.status === "loading" ? "Generating" : "Generate"}
                            </button>

                            {currentStrategy?.status === "ready" && currentStrategy.strategy ? (
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                                <p>{currentStrategy.strategy}</p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-emerald-300/80">
                                  {currentStrategy.source === "ai" ? "Gemini" : "Deterministic fallback"}
                                </p>
                              </div>
                            ) : null}

                            {currentStrategy?.status === "error" ? (
                              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                                {currentStrategy.error}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-zinc-500">{formatDate(lead.createdAt)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                      No leads found. Waiting for first submission.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
