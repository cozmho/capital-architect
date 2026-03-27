import { CircleCheckBig, Gauge, ShieldCheck } from "lucide-react";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-10">
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Client Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Membership access is active. Track your intake progress and account milestones from one place.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Intake Status</p>
              <CircleCheckBig className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="mt-3 text-xl font-semibold text-white">Submitted</p>
            <p className="mt-1 text-sm text-zinc-400">Your intake is in review.</p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Progress</p>
              <Gauge className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="mt-3 text-xl font-semibold text-white">In Progress</p>
            <p className="mt-1 text-sm text-zinc-400">Updates will appear as your profile advances.</p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Membership</p>
              <ShieldCheck className="h-5 w-5 text-violet-300" />
            </div>
            <p className="mt-3 text-xl font-semibold text-white">Paid Access</p>
            <p className="mt-1 text-sm text-zinc-400">Full dashboard tracking is enabled for your account.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
