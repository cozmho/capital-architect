import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  message: string;
};

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-12 text-center">
      <Icon className="mb-4 h-10 w-10 text-zinc-600" />
      <p className="text-lg font-medium text-zinc-300">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">{message}</p>
    </div>
  );
}
