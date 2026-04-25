import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  delta: string;
  icon: LucideIcon;
  /** Tailwind gradient classes, e.g. "from-cyan-400/20 to-cyan-600/5" */
  tone?: string;
};

export default function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  tone = "from-zinc-400/10 to-zinc-600/5",
}: StatCardProps) {
  return (
    <article
      className={`rounded-2xl border border-zinc-800/80 bg-linear-to-br ${tone} p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-300">{title}</p>
        <Icon className="h-5 w-5 text-zinc-200" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-400">{delta}</p>
    </article>
  );
}
