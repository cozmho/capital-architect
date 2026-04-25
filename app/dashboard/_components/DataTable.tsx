import type { ReactNode } from "react";
import Link from "next/link";
import EmptyState from "./EmptyState";

/* ── Column definition ── */
export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Optional width class, e.g. "w-40" */
  className?: string;
};

/* ── Pagination ── */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Base path without query params, e.g. "/dashboard/admin" */
  basePath: string;
  /** Additional query params to preserve */
  extraParams?: Record<string, string>;
};

/* ── Table props ── */
type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  /** Unique key extractor for each row */
  rowKey: (row: T) => string;
  /** Title displayed above the table */
  title?: string;
  /** Optional right-side header content (badges, action buttons) */
  headerActions?: ReactNode;
  /** Empty state message when rows.length === 0 */
  emptyMessage?: string;
  /** Pagination config — omit to hide pagination */
  pagination?: PaginationProps;
};

function Pagination({ currentPage, totalPages, basePath, extraParams = {} }: PaginationProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams({ page: String(page), ...extraParams });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 border-t border-zinc-800/60 px-6 py-4">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-700 ${
          currentPage <= 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Previous
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            page === currentPage
              ? "bg-[#C8A84B] text-zinc-950"
              : "border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={`rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-700 ${
          currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next
      </Link>
    </div>
  );
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  title,
  headerActions,
  emptyMessage = "No data to display.",
  pagination,
}: DataTableProps<T>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60">
      {/* Header */}
      {(title || headerActions) && (
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Table or empty state */}
      {rows.length === 0 ? (
        <div className="px-6 py-4">
          <EmptyState message={emptyMessage} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 font-medium ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-zinc-900/70 text-zinc-200 transition hover:bg-zinc-800/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && <Pagination {...pagination} />}
    </section>
  );
}
