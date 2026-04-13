import { CircleCheckBig, Gauge, ShieldCheck, ArrowRight, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getPrismaClient } from "@/lib/prisma";
import Link from "next/link";

export default async function ClientDashboardPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  
  const prisma = getPrismaClient();
  const lead = email ? await prisma.lead.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }
  }) : null;

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

        {lead && lead.fundabilityScore !== null ? (
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 flex flex-col items-center text-center justify-center">
              <p className="text-sm uppercase tracking-wider text-zinc-400 mb-2">Fundability Score</p>
              <div className="text-6xl font-serif text-[#C8A84B] mb-4">
                {lead.fundabilityScore}
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${
                lead.tier === 'A' ? 'bg-[#C8A84B]/20 text-[#C8A84B] border border-[#C8A84B]/30' :
                lead.tier === 'B' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {lead.tier === 'A' && <CheckCircle2 className="w-4 h-4" />}
                {lead.tier === 'B' && <TrendingUp className="w-4 h-4" />}
                {lead.tier === 'C' && <AlertCircle className="w-4 h-4" />}
                Tier {lead.tier}
              </div>
            </article>

            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Underwriting Feedback</h2>
              {lead.notes ? (
                <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800">
                  <p className="text-zinc-300 leading-relaxed text-sm">
                    {lead.notes}
                  </p>
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">Your profile is currently under review by our underwriting team. Feedback will appear here shortly.</p>
              )}
              
              <div className="mt-6 pt-6 border-t border-zinc-800/80">
                <p className="text-sm text-zinc-400 mb-4">Next Steps Based on Your Tier:</p>
                <div className="flex flex-wrap gap-3">
                  {lead.tier === 'A' && (
                    <Link href="/assess/results/ready" className="inline-flex items-center gap-2 bg-[#C8A84B] text-[#060A14] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#B89A42] transition text-sm">
                      Lock in Terms <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {lead.tier === 'B' && (
                    <Link href="/assess/results/prep" className="inline-flex items-center gap-2 bg-yellow-500 text-[#060A14] font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition text-sm">
                      Start Readiness Intensive <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {lead.tier === 'C' && (
                    <Link href="/assess/results/repair" className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red-600 transition text-sm">
                      Get Repair Kit <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-8 text-center flex flex-col items-center">
            <Gauge className="w-12 h-12 text-cyan-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Fundability Unscored</h2>
            <p className="text-zinc-400 max-w-md mb-6">
              You haven't completed your full underwriting intake yet. We need this information to calculate your Verdic™ score and assign your funding tier.
            </p>
            <Link href="/dashboard/client/intake" className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/60 text-cyan-100 font-semibold px-6 py-3 rounded-xl hover:bg-cyan-500/30 transition">
              Complete Intake Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3 mt-4">
          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Intake Status</p>
              <CircleCheckBig className={`h-5 w-5 ${lead ? 'text-emerald-300' : 'text-zinc-500'}`} />
            </div>
            <p className="mt-3 text-xl font-semibold text-white">{lead ? 'Submitted' : 'Pending'}</p>
            <p className="mt-1 text-sm text-zinc-400">{lead ? 'Your intake is on file.' : 'Please complete your intake.'}</p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Progress</p>
              <Gauge className={`h-5 w-5 ${lead?.fundabilityScore !== null ? 'text-cyan-300' : 'text-zinc-500'}`} />
            </div>
            <p className="mt-3 text-xl font-semibold text-white">{lead?.fundabilityScore !== null ? 'Scored' : 'In Progress'}</p>
            <p className="mt-1 text-sm text-zinc-400">{lead?.fundabilityScore !== null ? 'Your tier has been assigned.' : 'Updates will appear as your profile advances.'}</p>
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
