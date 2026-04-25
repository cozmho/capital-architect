import { Activity, BadgeDollarSign, Crown, Key, TrendingUp, Users } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getPrismaClient } from "@/lib/prisma";
import { StatCard, PageHeader, DataTable, StatusBadge, tierToVariant } from "../_components";
import type { Column } from "../_components";

export const dynamic = "force-dynamic";

type PipelineLead = {
  id: string;
  businessName: string;
  tier: string;
  adb: number;
  status: string;
};

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

const columns: Column<PipelineLead>[] = [
  {
    key: "business",
    header: "Business",
    render: (row) => row.businessName,
  },
  {
    key: "source",
    header: "Source",
    render: (row) => <StatusBadge label={displaySource(row.status)} variant="neutral" />,
  },
  {
    key: "tier",
    header: "Tier",
    render: (row) => <StatusBadge label={row.tier} variant={tierToVariant(row.tier)} />,
  },
  {
    key: "adb",
    header: "ADB",
    render: (row) => formatAdb(row.adb),
  },
  {
    key: "stage",
    header: "Stage",
    render: (row) => <span className="text-zinc-300">{row.status.replaceAll("_", " ")}</span>,
  },
];

export default async function GodModeCommandPage() {
  const { userId } = await auth();
  const isDevelopment = process.env.NODE_ENV !== "production";
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
        <PageHeader
          title="God Mode"
          description="Pipeline intelligence, lead quality, and momentum at a glance."
          actions={
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
                <Activity className="h-4 w-4 text-cyan-300" />
                Live mode
              </div>
              {userId && isDevelopment && (
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
                  <Key className="h-3 w-3 text-amber-400" />
                  Your Clerk ID: <span className="font-mono text-zinc-300">{userId}</span>
                </div>
              )}
            </>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <DataTable
          title="Recent Lead Intake"
          headerActions={
            <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              Syncing with intake API
            </div>
          }
          columns={columns}
          rows={recentPipeline}
          rowKey={(row) => row.id}
          emptyMessage="No leads yet. Submit a test intake to see rows appear here."
        />
      </section>
    </main>
  );
}
