import { redirect } from "next/navigation";

/**
 * /dashboard/admin now redirects to /dashboard/god-mode which is the
 * canonical owner dashboard built on the shared component system.
 *
 * Sub-routes under /dashboard/admin/* (scoring, leads, plan, lead-scoring)
 * remain intact — they provide detailed views not yet ported to God Mode.
 */
export default function AdminDashboardPage() {
  redirect("/dashboard/god-mode");
}
