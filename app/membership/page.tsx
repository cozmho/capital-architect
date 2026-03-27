import Link from "next/link";
import { CheckCircle2, Crown, ShieldCheck } from "lucide-react";

export default function MembershipPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_CHECKOUT_URL;
  const bookingUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_BOOKING_URL;
  const contactEmail = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTACT_EMAIL ?? "support@capitalarchitect.com";

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Client Membership Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-300">
            Intake submission is free. Full progress tracking, milestone updates, and client portal access are available with a paid membership.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
            >
              Submit Free Intake
            </Link>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
              >
                Start Membership Checkout
              </a>
            ) : (
              <a
                href={`mailto:${contactEmail}?subject=Capital%20Architect%20Membership`}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
              >
                Request Membership Access
              </a>
            )}
            {bookingUrl ? (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
              >
                Book Membership Call
              </a>
            ) : null}
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Portal Access</p>
              <Crown className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-3 text-lg font-semibold text-white">Paid Members</p>
            <p className="mt-1 text-sm text-zinc-400">Unlock the private client dashboard route and live updates.</p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Status Tracking</p>
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>
            <p className="mt-3 text-lg font-semibold text-white">Milestones</p>
            <p className="mt-1 text-sm text-zinc-400">Track progress from intake through qualification milestones.</p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Access Control</p>
              <ShieldCheck className="h-5 w-5 text-violet-300" />
            </div>
            <p className="mt-3 text-lg font-semibold text-white">Secure By Plan</p>
            <p className="mt-1 text-sm text-zinc-400">Portal visibility is enforced by role and paid membership metadata.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
