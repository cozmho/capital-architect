"use client";

import { CheckCircle2, XCircle, Circle } from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "pending";
  description: string;
}

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
  },
  fail: {
    icon: XCircle,
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/20",
    bgColor: "bg-rose-500/5",
  },
  pending: {
    icon: Circle,
    iconColor: "text-amber-400 animate-pulse",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
  },
};

export default function ComplianceAudit({ items }: { items: CheckItem[] }) {
  const passedCount = items.filter(i => i.status === "pass").length;
  const score = Math.round((passedCount / items.length) * 100);

  const scoreVariant =
    score >= 80
      ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-300"
      : score >= 60
        ? "border-amber-600/40 bg-amber-500/10 text-amber-300"
        : "border-rose-600/40 bg-rose-500/10 text-rose-300";

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/60 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Master Compliance Plan (MCP-20)
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Lender Credibility Audit — {score}% Compliant
          </p>
        </div>
        <span className={`inline-block rounded-lg border px-3 py-1.5 text-sm font-semibold ${scoreVariant}`}>
          {score}%
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-3 p-6 sm:grid-cols-2">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-xl border p-4 ${config.borderColor} ${config.bgColor}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
