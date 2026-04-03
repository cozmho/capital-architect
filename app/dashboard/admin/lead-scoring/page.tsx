import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type VerdictTier = "A" | "B" | "C" | "UNSCORED";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function AdminScoringPage() {
  // Verify user is authenticated
  await auth();

  // Keep CI/build environments working when DATABASE_URL is not configured.
  if (!process.env.DATABASE_URL) {
    return (
      <main className="min-h-screen bg-[#060A14] px-6 py-10 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-[#C8A84B]">God-Mode Dashboard</h1>
            <p className="mt-2 text-zinc-400">Fundability scoring and tier routing</p>
          </header>

          <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
            <p className="text-sm text-zinc-300">
              DATABASE_URL is not configured for this environment.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const prisma = getPrismaClient();

  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      businessName: true,
      ownerName: true,
      email: true,
      fundabilityScore: true,
      entityType: true,
      metro2ErrorCount: true,
      recentInquiries: true,
      complianceStatus: true,
      createdAt: true,
    },
    orderBy: {
      fundabilityScore: "desc",
    },
  });

  const leadsWithTiers = leads.map((lead) => ({
    ...lead,
    tier: computeTier(lead.fundabilityScore),
  }));

  const tierCounts = {
    A: leadsWithTiers.filter((l) => l.tier === "A").length,
    B: leadsWithTiers.filter((l) => l.tier === "B").length,
    C: leadsWithTiers.filter((l) => l.tier === "C").length,
  };

  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#C8A84B]">God-Mode Dashboard</h1>
          <p className="mt-2 text-zinc-400">Fundability scoring and tier routing</p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#C8A84B]/40 bg-[#C8A84B]/10 p-6">
            <p className="text-sm text-zinc-400">Tier A</p>
            <p className="mt-2 text-3xl font-bold text-[#C8A84B]">{tierCounts.A}</p>
            <p className="mt-1 text-xs text-zinc-500">Ready for Funding</p>
          </div>
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-6">
            <p className="text-sm text-zinc-400">Tier B</p>
            <p className="mt-2 text-3xl font-bold text-yellow-300">{tierCounts.B}</p>
            <p className="mt-1 text-xs text-zinc-500">Needs Entity Work</p>
          </div>
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6">
            <p className="text-sm text-zinc-400">Tier C</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{tierCounts.C}</p>
            <p className="mt-1 text-xs text-zinc-500">Credit Repair First</p>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Name/Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Entity Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Metro 2 Errors
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Inquiries
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {leadsWithTiers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No leads found. Waiting for first submission.
                    </td>
                  </tr>
                ) : (
                  leadsWithTiers.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-zinc-800/50 transition hover:bg-zinc-800/30"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-zinc-200">
                            {lead.businessName || lead.ownerName || "Unknown"}
                          </p>
                          {lead.email && (
                            <p className="text-xs text-zinc-500">{lead.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-white">
                          {lead.fundabilityScore ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getTierBadgeClass(
                            lead.tier
                          )}`}
                        >
                          {lead.tier} · {getTierLabel(lead.tier)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {lead.entityType || "—"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-zinc-400">
                        {lead.metro2ErrorCount ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-zinc-400">
                        {lead.recentInquiries ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
