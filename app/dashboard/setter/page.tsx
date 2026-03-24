import { Activity, ClipboardList, FileClock, FolderKanban, Users } from "lucide-react";

const setterStats = [
  {
    title: "Tier B Leads",
    value: "118",
    delta: "+17 in active outreach",
    icon: Users,
    tone: "from-amber-400/20 to-amber-600/5",
  },
  {
    title: "$1,500 Intensives Sold",
    value: "11",
    delta: "+3 closed this week",
    icon: FolderKanban,
    tone: "from-cyan-400/20 to-cyan-600/5",
  },
  {
    title: "Documents Pending",
    value: "26",
    delta: "Follow-up needed today",
    icon: FileClock,
    tone: "from-rose-400/20 to-rose-600/5",
  },
] as const;

const documentTasks = [
  {
    client: "Lighthouse Property Group",
    task: "Collect latest 3 months of business bank statements",
    due: "Today, 4:00 PM",
    priority: "High",
  },
  {
    client: "Granite Point Holdings",
    task: "Request front and back ID copy from signer",
    due: "Tomorrow, 11:00 AM",
    priority: "High",
  },
  {
    client: "Mariner Growth Partners",
    task: "Confirm missing personal bank statement PDF",
    due: "Tomorrow, 3:00 PM",
    priority: "Medium",
  },
] as const;

export default function SetterDashboardPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Setter Dashboard</h1>
              <p className="mt-2 text-sm text-zinc-400">Qualify Tier B opportunities and clear document bottlenecks fast.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              <Activity className="h-4 w-4 text-cyan-300" />
              Outreach active
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {setterStats.map((stat) => {
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
            <h2 className="text-xl font-semibold text-white">Document Follow-Up Task List</h2>
            <div className="inline-flex items-center gap-2 text-sm text-amber-300">
              <ClipboardList className="h-4 w-4" />
              Action queue
            </div>
          </div>
          <ul className="space-y-3">
            {documentTasks.map((task) => (
              <li key={task.client} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-zinc-300">{task.client}</p>
                    <p className="mt-1 text-base font-medium text-white">{task.task}</p>
                    <p className="mt-2 text-sm text-zinc-400">Due: {task.due}</p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      task.priority === "High"
                        ? "border border-rose-600/50 bg-rose-500/10 text-rose-300"
                        : "border border-amber-600/50 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
