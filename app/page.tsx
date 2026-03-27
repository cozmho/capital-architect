import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasValidClerkPublishableKey = Boolean(publishableKey && !/x{8,}/i.test(publishableKey));

export default async function Home() {
  const { sessionClaims } = hasValidClerkPublishableKey ? await auth() : { sessionClaims: null };
  const claims = (sessionClaims ?? {}) as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
  };
  const role = claims.metadata?.role ?? claims.publicMetadata?.role;
  const canAccessCommandDashboard = role === "admin";

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Business Funding Qualification, Simplified
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">
            Start with a quick intake and receive a clear qualification path tailored to your business profile.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
            >
              Start Intake
            </Link>
            {canAccessCommandDashboard ? (
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
              >
                Open Command Dashboard
              </Link>
            ) : null}
          </div>
        </article>

        <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">What You Get</h2>
          <ul className="mt-5 space-y-4 text-sm text-zinc-300">
            <li>
              Fast eligibility review based on your submitted profile.
            </li>
            <li>
              Clear next steps tailored to your current funding readiness.
            </li>
            <li>
              Membership portal access for progress tracking (paid tier).
            </li>
          </ul>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400">
            Member dashboard access is reserved for authorized accounts.
          </div>
        </aside>
      </section>
    </main>
  );
}
