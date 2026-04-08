"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/leads";
import { CheckCircle2, FileClock, Archive, Loader2 } from "lucide-react";

type StatusToggleProps = {
  leadId: string;
  currentStatus: string;
};

const STATUS_OPTIONS = [
  { value: "PENDING_DOCS", label: "Pending Docs", icon: FileClock, color: "text-amber-400" },
  { value: "READY_FOR_CLOSER", label: "Ready for Closer", icon: CheckCircle2, color: "text-emerald-400" },
  { value: "ARCHIVED", label: "Archived", icon: Archive, color: "text-zinc-500" },
];

export function StatusToggle({ leadId, currentStatus }: StatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusUpdate = (newStatus: string) => {
    if (newStatus === optimisticStatus) return;
    
    setOptimisticStatus(newStatus);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (!result.success) {
        setOptimisticStatus(currentStatus);
        console.error("Failed to update status:", result.error);
      }
    });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = optimisticStatus === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => handleStatusUpdate(option.value)}
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all select-none
              ${isActive 
                ? "border-zinc-700 bg-zinc-800 text-white shadow-sm" 
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
              }
              ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
            title={`Set status to ${option.label}`}
          >
            {isPending && isActive ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Icon className={`h-3.5 w-3.5 ${option.color}`} />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
