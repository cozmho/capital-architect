import { notFound } from "next/navigation";
import { getPrismaClient } from "@/lib/prisma";
import { ArrowLeft, AlertCircle, CheckCircle2, Info, Building2, Search, FileWarning } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrismaClient();

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  // Scoring Logic Re-calculation for visualization
  const baseScore = 100;
  let currentScore = baseScore;
  const deductions: { label: string; value: number; type: "deduction" | "addition" | "neutral" }[] = [];

  // Metro 2 Deductions
  if (lead.metro2ErrorCount && lead.metro2ErrorCount > 0) {
    const penalty = lead.metro2ErrorCount * 15;
    deductions.push({
      label: `${lead.metro2ErrorCount} Metro 2 Errors (-15 each)`,
      value: penalty,
      type: "deduction",
    });
    currentScore -= penalty;
  }

  // Inquiry Deductions
  if (lead.recentInquiries !== null && lead.recentInquiries !== undefined) {
    if (lead.recentInquiries > 4) {
      deductions.push({
        label: `${lead.recentInquiries} Recent Inquiries (Critical)`,
        value: 20,
        type: "deduction",
      });
      currentScore -= 20;
    } else if (lead.recentInquiries >= 2) {
      deductions.push({
        label: `${lead.recentInquiries} Recent Inquiries (Moderate)`,
        value: 10,
        type: "deduction",
      });
      currentScore -= 10;
    }
  }

  // Entity Type Additions
  if (lead.entityType === "LLC") {
    deductions.push({
      label: "LLC Entity Type Bonus",
      value: 10,
      type: "addition",
    });
    currentScore += 10;
  } else if (lead.entityType === "Private Trust") {
    deductions.push({
      label: "Private Trust Bonus",
      value: 15,
      type: "addition",
    });
    currentScore += 15;
  }

  const finalScore = Math.max(0, Math.min(100, currentScore));

  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/admin/scoring"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scoring
        </Link>

        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#C8A84B]">Lead Detail View</p>
            <h1 className="mt-2 text-4xl font-bold text-white">
              {lead.businessName || lead.ownerName || "Untitled Lead"}
            </h1>
            <p className="mt-1 text-zinc-400">{lead.email || "No email provided"}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center shadow-xl backdrop-blur-sm">
            <p className="text-sm text-zinc-400">Fundability Score</p>
            <p className="text-5xl font-black text-[#C8A84B]">{lead.fundabilityScore ?? "—"}</p>
            <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-tighter">
              Tier {lead.tier} Lead
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Scoring Deductions Panel */}
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <AlertCircle className="h-5 w-5 text-[#C8A84B]" />
                Score Deduction Logic
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm text-zinc-400">
                  <span>Baseline Algorithm Starting Score</span>
                  <span className="font-mono text-zinc-200">100</span>
                </div>

                {deductions.length > 0 ? (
                  deductions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        {d.type === "deduction" ? (
                          <FileWarning className="h-4 w-4 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                        <span className="text-sm text-zinc-300">{d.label}</span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          d.type === "deduction" ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {d.type === "deduction" ? "-" : "+"}
                        {d.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-zinc-500 italic">
                    No deductions or bonuses applied.
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-800/50 p-4 border border-zinc-700/50">
                  <span className="font-semibold text-white">Final Calculated Score</span>
                  <span className="text-2xl font-bold text-[#C8A84B]">{finalScore}</span>
                </div>
              </div>
            </div>

            {/* Metro 2 Compliance Detail */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Search className="h-5 w-5 text-cyan-400" />
                Metro 2 Compliance Audit
              </h2>
              <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-black/20">
                <div className="bg-zinc-800/50 px-4 py-2 text-xs font-bold uppercase text-zinc-500">
                  System Audit Log
                </div>
                <div className="p-4 text-sm text-zinc-400 leading-relaxed">
                  {lead.metro2ErrorCount && lead.metro2ErrorCount > 0 ? (
                    <div className="space-y-4">
                      <p>
                        Found <span className="text-rose-400 font-bold">{lead.metro2ErrorCount}</span> formatting
                        discrepancies that violate Metro 2 standards. These errors typically involve
                        incorrect status codes, payment history misalignment, or mismatched identifier
                        fields.
                      </p>
                      <ul className="list-inside list-disc space-y-2 text-zinc-500">
                        <li>Payment Status Inconsistency</li>
                        <li>Account Type Mismatch</li>
                        <li>Compliance Condition Code Missing</li>
                      </ul>
                      <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-rose-300 text-xs">
                        <strong>Action Required:</strong> Immediate data scrubbing recommended before
                        resubmitting to credit bureaus.
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>All Metro 2 formatting checks passed. No structural errors detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Lead Info Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Entity Details</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500">Business Type</p>
                    <p className="text-sm text-zinc-200">{lead.entityType || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-zinc-500" />
                  <div>
                    <p className="text-xs text-zinc-500">Time in Business</p>
                    <p className="text-sm text-zinc-200">
                      {lead.timeInBusiness ? `${lead.timeInBusiness} months` : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Financial Snapshot</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-zinc-500">Monthly Revenue</p>
                  <p className="text-sm font-medium text-emerald-400">
                    {lead.monthlyRevenue ? `$${lead.monthlyRevenue.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">FICO Score</p>
                  <p className="text-sm font-medium text-white">{lead.ficoScore || "—"}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
