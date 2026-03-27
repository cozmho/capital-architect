import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Credit Compliance And Funding Qualification Engine
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">
            Submit your intake once. Our underwriting logic routes your profile immediately into the right track.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
            >
              Start Intake
            </Link>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
            >
              Open Command Dashboard
            </Link>
          </div>
        </article>

        <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">How It Works</h2>
          <ol className="mt-5 space-y-4 text-sm text-zinc-300">
            <li>
              1. Lead completes the intake form with fundability signals.
            </li>
            <li>
              2. API assigns Tier A, B, C, or Check Manually in real time.
            </li>
            <li>
              3. Admin dashboard tracks source and intake stage for VA execution.
            </li>
          </ol>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400">
            Primary flow: website intake.
            <br />
            Optional fallback: Google or Calendly webhook forwarding.
          </div>
        </aside>
      </section>
    </main>
  );
}
