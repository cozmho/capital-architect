import { Activity, ClipboardCheck, Crown, Handshake, TrendingUp } from "lucide-react";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function CloserDashboardPage() {
  const prisma = getPrismaClient();

  const [tierALeadCount, intakeReadyCount, fundedCount, fundingReviewLeads] = await Promise.all([
    prisma.lead.count({ where: { tier: "A" } }),
    prisma.lead.count({
      where: {
        tier: "A",
        status: {
          in: ["INTAKE_WEBSITE", "INTAKE_GOOGLE", "INTAKE_CALENDLY", "INTAKE_FORM", "PENDING_REVIEW"],
        },
      },
    }),
    prisma.lead.count({
      where: {
        tier: "A",
        status: {
          in: ["CONTRACT_SENT", "FUNDED", "CLOSED_WON"],
        },
      },
    }),
    prisma.lead.findMany({
      where: {
        tier: "A",
        status: {
          in: ["INTAKE_WEBSITE", "INTAKE_GOOGLE", "INTAKE_CALENDLY", "INTAKE_FORM", "PENDING_DOCS", "PENDING_REVIEW"],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        businessName: true,
        adb: true,
        createdAt: true,
        status: true,
      },
    }),
  ]);

  const closerStats = [
    {
      title: "Tier A Leads",
      value: String(tierALeadCount),
      delta: "Live count from Supabase",
      icon: Crown,
      tone: "from-emerald-400/20 to-emerald-600/5",
    },
    {
      title: "Ready For Review",
      value: String(intakeReadyCount),
      delta: "Intake-qualified A tier leads",
      icon: Handshake,
      tone: "from-cyan-400/20 to-cyan-600/5",
    },
    {
      title: "Contracts/Funded",
      value: String(fundedCount),
      delta: "A tier leads in closing stages",
      icon: ClipboardCheck,
      tone: "from-amber-400/20 to-amber-600/5",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Closer Dashboard</h1>
              <p className="mt-2 text-sm text-zinc-400">Drive Tier A conversations from strategy call to funded commitments.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              <Activity className="h-4 w-4 text-cyan-300" />
              Live pipeline
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {closerStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.title}
                className={`rounded-2xl border border-zinc-800/80 bg-linear-to-br ${stat.tone} p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-300">{stat.title}</p>
                  <Icon className="h-5 w-5 text-zinc-200" />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.delta}</p>
              </article>
            );
          })}
        </div>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Tier A Leads Ready For Funding Review</h2>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              High closing velocity
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-135 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 pr-4 font-medium">Lead</th>
                  <th className="py-3 pr-4 font-medium">ADB Signal</th>
                  <th className="py-3 pr-4 font-medium">Intake Date</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {fundingReviewLeads.length ? (
                  fundingReviewLeads.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-900/70 text-zinc-200">
                      <td className="py-3 pr-4">{item.businessName}</td>
                      <td className="py-3 pr-4">{item.adb != null ? `${item.adb}%` : "—"}</td>
                      <td className="py-3 pr-4">{formatDate(item.createdAt)}</td>
                      <td className="py-3">
                        <span className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-6 text-zinc-400" colSpan={4}>
                      No Tier A leads are currently ready for funding review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
