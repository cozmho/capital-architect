import { Activity, ClipboardList, FileClock, FolderKanban, Users } from "lucide-react";
import { getPrismaClient } from "@/lib/prisma";
import { StatusToggle } from "./_components/StatusToggle";

export const dynamic = "force-dynamic";

function priorityFromAdb(adb: number): "High" | "Medium" {
  return adb >= 80 ? "High" : "Medium";
}

function nextSetterTask(status: string): string {
  if (status === "PENDING_DOCS") return "Collect required business docs";
  if (status.startsWith("INTAKE_")) return "Begin qualification outreach";
  return "Review lead file and update pipeline";
}

export default async function SetterDashboardPage() {
  const prisma = getPrismaClient();

  const [tierBLeadCount, pendingDocsCount, outreachQueueCount, setterQueue] = await Promise.all([
    prisma.lead.count({ where: { tier: "B" } }),
    prisma.lead.count({
      where: {
        tier: { in: ["B", "CHECK_MANUALLY"] },
        status: "PENDING_DOCS",
      },
    }),
    prisma.lead.count({
      where: {
        tier: "B",
        status: {
          in: ["INTAKE_WEBSITE", "INTAKE_GOOGLE", "INTAKE_CALENDLY", "INTAKE_FORM", "PENDING_DOCS"],
        },
      },
    }),
    prisma.lead.findMany({
      where: {
        tier: { in: ["B", "CHECK_MANUALLY"] },
        status: {
          in: ["PENDING_DOCS", "INTAKE_WEBSITE", "INTAKE_GOOGLE", "INTAKE_CALENDLY", "INTAKE_FORM"],
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

  const setterStats = [
    {
      title: "Tier B Leads",
      value: String(tierBLeadCount),
      delta: "Live count from Supabase",
      icon: Users,
      tone: "from-amber-400/20 to-amber-600/5",
    },
    {
      title: "Outreach Queue",
      value: String(outreachQueueCount),
      delta: "B tier leads in active setter pipeline",
      icon: FolderKanban,
      tone: "from-cyan-400/20 to-cyan-600/5",
    },
    {
      title: "Documents Pending",
      value: String(pendingDocsCount),
      delta: "Follow-up needed to unblock closer handoff",
      icon: FileClock,
      tone: "from-rose-400/20 to-rose-600/5",
    },
  ] as const;

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
            {setterQueue.length ? (
              setterQueue.map((task) => {
                const priority = priorityFromAdb(task.adb);
                return (
                  <li key={task.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300">{task.businessName}</p>
                        <p className="mt-1 text-base font-medium text-white">{nextSetterTask(task.status)}</p>
                        <StatusToggle leadId={task.id} currentStatus={task.status} />
                      </div>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${
                          priority === "High"
                            ? "border border-rose-600/50 bg-rose-500/10 text-rose-300"
                            : "border border-amber-600/50 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {priority}
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
                No setter follow-up tasks are pending.
              </li>
            )}
          </ul>
        </section>
      </section>
    </main>
  );
}
