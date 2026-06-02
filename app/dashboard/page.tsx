import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Lock, ArrowRight, FileText, Columns3, MessageCircle, Download } from "lucide-react";
import ComplianceAudit from "@/components/ComplianceAudit";

const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_TIER_B_STRIPE_URL ||
  process.env.NEXT_PUBLIC_MEMBERSHIP_CHECKOUT_URL ||
  "/membership";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";

  // Check Stripe for payment status using Clerk email
  const email = user?.emailAddresses?.[0]?.emailAddress;
  let hasPaid = false;

  if (email) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/check-payment?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      hasPaid = data.paid === true;
    } catch {
      hasPaid = false;
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        {/* Header */}
        <header className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Your Funding Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Welcome back, {firstName}. Here&apos;s your capital architecture overview.
          </p>
        </header>

        {!hasPaid ? (
          /* ==========================================
             UNPAID STATE — Show upgrade prompt
          ========================================== */
          <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C8A84B]/30 bg-[#C8A84B]/10">
                <Lock className="h-8 w-8 text-[#C8A84B]" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Unlock Your Funding Roadmap
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Purchase your personalized Funding Roadmap to access your full
                dashboard — including your capital stack, dispute templates,
                milestone tracker, and strategy playbook.
              </p>
              <a
                href={STRIPE_PAYMENT_LINK}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C8A84B] px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-[#d4b85c]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unlock for $350
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-4 text-xs text-zinc-500">
                One-time purchase. No subscription.
              </p>
            </div>
          </div>
        ) : (
          /* ==========================================
             PAID STATE — Full dashboard
          ========================================== */
          <>
            {/* MCP-20 Compliance Audit */}
            <ComplianceAudit items={[
              { id: "ein", label: "Tax ID (EIN)", status: "pass", description: "Business EIN is registered and active." },
              { id: "entity", label: "Legal Entity", status: "pass", description: "LLC/Corp is in good standing with SOS." },
              { id: "bank", label: "Business Bank", status: "pass", description: "Dedicated commercial banking active." },
              { id: "email", label: "Prof. Email", status: "fail", description: "Use @domain.com instead of @gmail.com." },
              { id: "address", label: "Business Address", status: "fail", description: "Commercial or Virtual office required." },
              { id: "phone", label: "Business Phone", status: "pass", description: "Dedicated business line detected." },
              { id: "website", label: "Business Website", status: "fail", description: "Professional site with SSL required." },
              { id: "duns", label: "D-U-N-S Number", status: "pass", description: "Registration verified with D&B." },
              { id: "naics", label: "NAICS Code", status: "pass", description: "Low-risk industry coding detected." },
              { id: "listings", label: "411/Directory", status: "pending", description: "National directory listing check active." },
            ]} />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Funding Roadmap */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Your Funding Roadmap</h3>
                  <span className="rounded-md border border-amber-600/40 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300">
                    Tier B
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight text-[#C8A84B]">60-90</span>
                    <span className="text-sm text-zinc-400">Days to Tier A</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Based on your score of 69, your primary bottleneck is
                    <strong className="text-zinc-200"> Credibility Compliance</strong> and
                    <strong className="text-zinc-200"> Metro 2 reporting errors</strong>.
                  </p>
                  <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#C8A84B]/40 bg-[#C8A84B]/10 px-4 py-3 text-sm font-semibold text-[#C8A84B] transition hover:bg-[#C8A84B]/20">
                    <Download className="h-4 w-4" />
                    Download PDF Roadmap
                  </button>
                </div>
              </div>

              {/* Template Vault */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white">Template Vault</h3>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/dashboard/dispute-letter"
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  >
                    <FileText className="h-4 w-4 text-[#C8A84B]" />
                    FCRA §611 Dispute Letter
                  </Link>
                  <Link
                    href="/dashboard/metro2-compliance"
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  >
                    <Columns3 className="h-4 w-4 text-[#C8A84B]" />
                    Metro 2 Compliance Template
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-[#C8A84B]" />
                    Custom Letter Support
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
