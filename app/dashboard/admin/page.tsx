import { Activity, BadgeDollarSign, Crown, TrendingUp, Users } from "lucide-react";

const dashboardStats = [
  {
    title: "Total Pipeline",
    value: "$7.8M",
    delta: "+12.4% this month",
    icon: BadgeDollarSign,
    tone: "from-cyan-400/20 to-cyan-600/5",
  },
  {
    title: "Tier A Leads",
    value: "48",
    delta: "+9 qualified this week",
    icon: Crown,
    tone: "from-emerald-400/20 to-emerald-600/5",
  },
  {
    title: "Tier B Leads",
    value: "126",
    delta: "+21 engaged this week",
    icon: Users,
    tone: "from-amber-400/20 to-amber-600/5",
  },
] as const;

const recentPipeline = [
  { account: "Northline Developments", tier: "A", amount: "$1.3M", stage: "Underwriting" },
  { account: "Rivermark Holdings", tier: "A", amount: "$980K", stage: "Term Sheet" },
  { account: "Atlas Cornerstone", tier: "B", amount: "$620K", stage: "Review" },
  { account: "Parkview Capital", tier: "B", amount: "$540K", stage: "Nurture" },
];

export default function AdminDashboardPage() {
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
            <h2 className="text-xl font-semibold text-white">Recent Pipeline Movement</h2>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              Positive trajectory
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-135 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-3 pr-4 font-medium">Account</th>
                  <th className="py-3 pr-4 font-medium">Tier</th>
                  <th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 font-medium">Stage</th>
                </tr>
              </thead>
              <tbody>
                {recentPipeline.map((item) => (
                  <tr key={item.account} className="border-b border-zinc-900/70 text-zinc-200">
                    <td className="py-3 pr-4">{item.account}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200">
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{item.amount}</td>
                    <td className="py-3 text-zinc-300">{item.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
