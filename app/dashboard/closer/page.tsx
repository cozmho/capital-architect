import { Activity, ClipboardCheck, Crown, Handshake, TrendingUp } from "lucide-react";
import { getPrismaClient } from "@/lib/prisma";
import { StatCard, PageHeader, DataTable, StatusBadge } from "../_components";
import type { Column } from "../_components";

export const dynamic = "force-dynamic";

type CloserLead = {
  id: string;
  businessName: string;
  adb: number;
  createdAt: Date;
  status: string;
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

const columns: Column<CloserLead>[] = [
  {
    key: "lead",
    header: "Lead",
    render: (row) => row.businessName,
  },
  {
    key: "adb",
    header: "ADB Signal",
    render: (row) => <span>{row.adb}%</span>,
  },
  {
    key: "intake",
    header: "Intake Date",
    render: (row) => formatDate(row.createdAt),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge label={row.status} variant="success" />,
  },
];

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
        <PageHeader
          title="Closer Dashboard"
          description="Drive Tier A conversations from strategy call to funded commitments."
          actions={
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              <Activity className="h-4 w-4 text-cyan-300" />
              Live pipeline
            </div>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {closerStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <DataTable
          title="Tier A Leads Ready For Funding Review"
          headerActions={
            <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp className="h-4 w-4" />
              High closing velocity
            </div>
          }
          columns={columns}
          rows={fundingReviewLeads}
          rowKey={(row) => row.id}
          emptyMessage="No Tier A leads are currently ready for funding review."
        />
      </section>
    </main>
  );
}
