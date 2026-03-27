import { Activity, BadgeDollarSign, Crown, TrendingUp, Users } from "lucide-react";
import { getPrismaClient } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function displaySource(status: string): string {
  if (status.includes("WEBSITE")) return "Website";
  if (status.includes("GOOGLE")) return "Google";
  if (status.includes("CALENDLY")) return "Calendly";
  return "Unknown";
}

function formatAdb(adb: number): string {
  if (!adb) return "Not provided";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(adb);
}

export default async function AdminDashboardPage() {
  const prisma = getPrismaClient();
  const [totalLeads, tierALeads, tierBLeads, recentPipeline] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { tier: "A" } }),
    prisma.lead.count({ where: { tier: "B" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        businessName: true,
        tier: true,
        adb: true,
        status: true,
      },
    }),
  ]);

  const dashboardStats = [
    {
      title: "Total Leads",
      value: totalLeads.toLocaleString(),
      delta: "Live from Prisma",
      icon: BadgeDollarSign,
      tone: "from-cyan-400/20 to-cyan-600/5",
    },
    {
      title: "Tier A Leads",
      value: tierALeads.toLocaleString(),
      delta: "Ready for closer",
      icon: Crown,
      tone: "from-emerald-400/20 to-emerald-600/5",
    },
    {
      title: "Tier B Leads",
      value: tierBLeads.toLocaleString(),
      delta: "Setter nurture queue",
      icon: Users,
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
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-zinc-400">Pipeline intelligence, lead quality, and momentum at a glance.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              <Activity className="h-4 w-4 text-cyan-300" />
              Live mode
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {dashboardStats.map((stat) => {
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
            <h2 className="text-xl font-semibold text-white">Recent Lead Intake</h2>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              Syncing with intake API
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-135 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 pr-4 font-medium">Business</th>
                  <th className="py-3 pr-4 font-medium">Source</th>
                  <th className="py-3 pr-4 font-medium">Tier</th>
                  <th className="py-3 pr-4 font-medium">ADB</th>
                  <th className="py-3 font-medium">Stage</th>
                </tr>
              </thead>
              <tbody>
                {recentPipeline.length === 0 ? (
                  <tr className="text-zinc-400">
                    <td className="py-6" colSpan={5}>
                      No leads yet. Submit a test intake to see rows appear here.
                    </td>
                  </tr>
                ) : (
                  recentPipeline.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-900/70 text-zinc-200">
                      <td className="py-3 pr-4">{item.businessName}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200">
                          {displaySource(item.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200">
                          {item.tier}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{formatAdb(item.adb)}</td>
                      <td className="py-3 text-zinc-300">{item.status.replaceAll("_", " ")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
