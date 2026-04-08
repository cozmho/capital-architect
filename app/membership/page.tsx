import Link from "next/link";
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, Crown, Mail, ShieldCheck } from "lucide-react";
import { TrackedExternalLink } from "./tracked-external-link";

type MembershipPageProps = {
  searchParams?: {
    tier?: string | string[];
  };
};

function getTierValue(tier: string | string[] | undefined): "A" | "B" | "C" | null {
  const normalized = (Array.isArray(tier) ? tier[0] : tier)?.toUpperCase();
  if (normalized === "A" || normalized === "B" || normalized === "C") return normalized;
  return null;
}

export default function MembershipPage({ searchParams }: MembershipPageProps) {
  const tier = getTierValue(searchParams?.tier);

  const checkoutUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_CHECKOUT_URL;
  const tierBCheckoutUrl = process.env.NEXT_PUBLIC_TIER_B_STRIPE_URL || checkoutUrl;
  const bookingUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_BOOKING_URL;
  const repairKitUrl = process.env.NEXT_PUBLIC_REPAIR_KIT_URL;
  const contactEmail = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTACT_EMAIL || "support@capitalarchitect.tech";

  const tierLabel = tier ? `Tier ${tier} Path` : "General Membership Path";

  const primaryAction =
    tier === "A"
      ? {
          href: bookingUrl || `mailto:${contactEmail}?subject=Capital%20Architect%20Strategy%20Call`,
          text: "Book Your Strategy Call",
          event: "membership_call_click" as const,
        }
      : tier === "B"
      ? {
          href:
            tierBCheckoutUrl ||
            `mailto:${contactEmail}?subject=Capital%20Architect%20Funding%20Readiness%20Intensive`,
          text: "Start Tier B Intensive Checkout",
          event: "membership_checkout_click" as const,
        }
      : tier === "C"
      ? {
          href: repairKitUrl || `mailto:${contactEmail}?subject=Capital%20Architect%20Repair%20Kit`,
          text: "Get the DIY Repair Kit",
          event: "membership_contact_click" as const,
        }
      : {
          href: checkoutUrl || `mailto:${contactEmail}?subject=Capital%20Architect%20Membership`,
          text: checkoutUrl ? "Start Membership Checkout" : "Request Membership Access",
          event: checkoutUrl ? ("membership_checkout_click" as const) : ("membership_contact_click" as const),
        };

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Client Membership Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-300">
            Intake submission is free. Full progress tracking, milestone updates, and private client portal access are available with a paid membership.
          </p>
          <div className="mt-4 inline-flex rounded-full border border-[#C8A84B]/40 bg-[#C8A84B]/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#C8A84B] uppercase">
            {tierLabel}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
            >
              Submit Free Intake
            </Link>
            <TrackedExternalLink
              href={primaryAction.href}
              target="_blank"
              rel="noreferrer"
              eventName={primaryAction.event}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/60 bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            >
              {tier === null ? <Mail className="h-4 w-4" /> : null}
              {primaryAction.text}
              <ArrowRight className="h-4 w-4" />
            </TrackedExternalLink>
            {bookingUrl ? (
              <TrackedExternalLink
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                eventName="membership_call_click"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Book Membership Call
              </TrackedExternalLink>
            ) : (
              <TrackedExternalLink
                href={`mailto:${contactEmail}?subject=Book%20a%20Membership%20Call`}
                eventName="membership_call_click"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Request A Membership Call
              </TrackedExternalLink>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/8 px-4 py-3 text-xs text-amber-100">
            <div className="flex items-center gap-2 text-amber-200">
              <Clock3 className="h-4 w-4" />
              <p className="font-semibold uppercase tracking-[0.14em]">Next Client Activation Window</p>
            </div>
            <p className="mt-2 leading-relaxed text-amber-100/90">
              Membership activations are processed in order received. Completing checkout now moves your account into the next onboarding queue without delaying access setup.
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-xs text-zinc-400">
            <p className="font-medium text-zinc-200">Need a direct line before checkout?</p>
            <p className="mt-1">
              Email 
              <TrackedExternalLink
                href={`mailto:${contactEmail}?subject=Capital%20Architect%20Membership`}
                eventName="membership_contact_click"
                className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition hover:decoration-zinc-300"
              >
                {contactEmail}
              </TrackedExternalLink>
              {checkoutUrl ? " or start checkout now." : " to get your private dashboard activated."}
            </p>
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
