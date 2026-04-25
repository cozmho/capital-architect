type Variant = "tier-a" | "tier-b" | "tier-c" | "success" | "warning" | "danger" | "neutral";

const variants: Record<Variant, string> = {
  "tier-a":  "border-emerald-600/40 bg-emerald-500/10 text-emerald-300",
  "tier-b":  "border-amber-600/40 bg-amber-500/10 text-amber-300",
  "tier-c":  "border-rose-600/40 bg-rose-500/10 text-rose-300",
  success:   "border-emerald-600/40 bg-emerald-500/10 text-emerald-300",
  warning:   "border-amber-600/40 bg-amber-500/10 text-amber-300",
  danger:    "border-rose-600/40 bg-rose-500/10 text-rose-300",
  neutral:   "border-zinc-700 bg-zinc-800 text-zinc-200",
};

type StatusBadgeProps = {
  label: string;
  variant?: Variant;
};

/**
 * Resolve a tier string (A, B, C) or status string to the appropriate variant.
 */
export function tierToVariant(tier: string): Variant {
  if (tier === "A") return "tier-a";
  if (tier === "B") return "tier-b";
  if (tier === "C") return "tier-c";
  return "neutral";
}

export function statusToVariant(status: string): Variant {
  if (["FUNDED", "CLOSED_WON", "CONTRACT_SENT"].includes(status)) return "success";
  if (["PENDING_DOCS", "PENDING_REVIEW"].includes(status)) return "warning";
  if (["REJECTED", "CLOSED_LOST"].includes(status)) return "danger";
  return "neutral";
}

export default function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
