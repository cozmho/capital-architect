import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional slot for action badges or buttons on the right side */
  actions?: ReactNode;
};

export default function PageHeader({
  eyebrow = "Capital Architect",
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-col items-end gap-2">{actions}</div>}
      </div>
    </header>
  );
}
