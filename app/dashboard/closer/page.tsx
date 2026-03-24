import { Activity, ClipboardCheck, Crown, Handshake, TrendingUp } from "lucide-react";

const closerStats = [
  {
    title: "Tier A Leads",
    value: "32",
    delta: "+6 hot this week",
    icon: Crown,
    tone: "from-emerald-400/20 to-emerald-600/5",
  },
  {
    title: "Strategy Calls Booked",
    value: "14",
    delta: "+4 from yesterday",
    icon: Handshake,
    tone: "from-cyan-400/20 to-cyan-600/5",
  },
  {
    title: "Contracts Out",
    value: "9",
    delta: "3 awaiting signatures",
    icon: ClipboardCheck,
    tone: "from-amber-400/20 to-amber-600/5",
  },
] as const;

const fundingReviewLeads = [
  {
    lead: "Orion Crest Ventures",
    amount: "$1.1M",
    callDate: "Mar 25, 2026",
    status: "Ready for review",
  },
  {
    lead: "Bluehaven Equity Group",
    amount: "$860K",
    callDate: "Mar 26, 2026",
    status: "Ready for review",
  },
  {
    lead: "Summit Harbor Capital",
    amount: "$740K",
    callDate: "Mar 27, 2026",
    status: "Ready for review",
  },
] as const;

export default function CloserDashboardPage() {
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
                  <th className="py-3 pr-4 font-medium">Potential Funding</th>
                  <th className="py-3 pr-4 font-medium">Strategy Call</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {fundingReviewLeads.map((item) => (
                  <tr key={item.lead} className="border-b border-zinc-900/70 text-zinc-200">
                    <td className="py-3 pr-4">{item.lead}</td>
                    <td className="py-3 pr-4">{item.amount}</td>
                    <td className="py-3 pr-4">{item.callDate}</td>
                    <td className="py-3">
                      <span className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                        {item.status}
                      </span>
                    </td>
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
