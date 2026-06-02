"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateLeadTier } from "@/app/actions/leads";
import { Loader2 } from "lucide-react";

type TierOverrideProps = {
  leadId: string;
  currentTier: string;
};

const TIERS = [
  { value: "A", label: "Tier A", color: "text-emerald-300 border-emerald-600/40 bg-emerald-500/10" },
  { value: "B", label: "Tier B", color: "text-amber-300 border-amber-600/40 bg-amber-500/10" },
  { value: "C", label: "Tier C", color: "text-rose-300 border-rose-600/40 bg-rose-500/10" },
];

function getTierStyle(tier: string) {
  return TIERS.find((t) => t.value === tier)?.color || "text-zinc-300 border-zinc-700 bg-zinc-800";
}

export function TierOverride({ leadId, currentTier }: TierOverrideProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTier, setOptimisticTier] = useState(currentTier);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (newTier: string) => {
    if (newTier === optimisticTier) {
      setIsOpen(false);
      return;
    }

    setOptimisticTier(newTier);
    setIsOpen(false);

    startTransition(async () => {
      const result = await updateLeadTier(leadId, newTier);
      if (!result.success) {
        setOptimisticTier(currentTier);
        console.error("Failed to update tier:", result.error);
      }
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-all ${getTierStyle(optimisticTier)} ${
          isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:brightness-125"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : null}
        Tier {optimisticTier}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          {TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => handleSelect(tier.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-medium transition hover:bg-zinc-800 ${
                optimisticTier === tier.value ? "bg-zinc-800 text-white" : "text-zinc-300"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${
                tier.value === "A" ? "bg-emerald-400" :
                tier.value === "B" ? "bg-amber-400" : "bg-rose-400"
              }`} />
              {tier.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
