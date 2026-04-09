import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  hasValidClerkPublishableKey,
  getUserRole,
  parseGodModeUserIds,
  hasPaidMembership as checkPaidMembership,
} from "@/lib/clerk-utils";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = hasValidClerkPublishableKey(publishableKey);
const godModeUserIds = parseGodModeUserIds();

export default async function Home() {
  const { sessionClaims, userId } = isClerkConfigured
    ? await auth()
    : { sessionClaims: null, userId: null };
  
  const role = getUserRole(sessionClaims as Record<string, unknown> | null);
  const hasPaidMembershipStatus = checkPaidMembership(sessionClaims as Record<string, unknown> | null);
  const hasGodModeOverride = Boolean(userId && godModeUserIds.has(userId));
  const canAccessClientDashboard = hasPaidMembershipStatus;
  const canAccessCommandDashboard = role === "admin" || hasGodModeOverride;

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            We fund you in 60 days when everyone else says no.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">
            Skip the bank runaround. Take our 60-Second Fundability Assessment and see exactly where you qualify—no jargon, no hedging, just your capital path.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/assess"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
            >
              Start Fundability Assessment
            </Link>
            {canAccessClientDashboard ? (
              <Link
                href="/dashboard/client"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
              >
                Access Your Funding Path
              </Link>
            ) : (
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-xl border border-amber-500/60 bg-amber-500/15 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/25"
              >
                Unlock Your Capital Plan
              </Link>
            )}
            {canAccessCommandDashboard ? (
              <Link
                href="/dashboard/god-mode"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
              >
                Enter God Mode
              </Link>
            ) : null}
          </div>
        </article>

        <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/65 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-2">See where you qualify</h2>
          <p className="text-sm text-zinc-300 mb-5">Every business is different. Here’s how we route you to the right capital path—no jargon, just outcomes:</p>
          <ul className="space-y-4 text-sm text-zinc-300">
            <li>
              <span className="font-semibold text-amber-300">Tier A:</span> 0% APR business credit + SBA pathway <span className="text-zinc-400">(60–90 days, $50K–$500K)</span>
            </li>
            <li>
              <span className="font-semibold text-cyan-300">Tier B:</span> Unsecured lines + merchant funding <span className="text-zinc-400">(30–45 days, $25K–$250K)</span>
            </li>
            <li>
              <span className="font-semibold text-rose-300">Tier C:</span> Credit repair + DIY toolkit + next-tier strategy <span className="text-zinc-400">($497 self-serve)</span>
            </li>
          </ul>
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400">
            <span className="font-semibold text-green-300">Proof:</span> 7 of our first 10 clients got funded.
          </div>
        </aside>
      </section>
    </main>
  );
}
