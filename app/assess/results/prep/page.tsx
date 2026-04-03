import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function PrepPage() {
  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-yellow-500/20 p-6">
            <TrendingUp className="h-16 w-16 text-yellow-500" />
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-white md:text-6xl">
          You&apos;re Close.
        </h1>
        <p className="mt-4 text-2xl font-light text-yellow-500">
          One sprint away from capital.
        </p>

        <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-8">
          <p className="text-lg text-zinc-300">
            Your fundability is within reach. A few structural fixes and you&apos;re in Tier A territory.
          </p>
          <p className="mt-4 text-zinc-400">
            Our Funding Readiness Intensive handles entity setup, credit positioning, and underwriting prep in one focused engagement.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href="https://buy.stripe.com/placeholder"
            target="_blank"
            className="inline-block w-full rounded-lg bg-yellow-500 px-8 py-5 text-lg font-semibold text-[#060A14] transition hover:bg-yellow-400"
          >
            Start Your Funding Readiness Intensive — $1,500
          </Link>
          <p className="text-sm text-zinc-500">
            14-day program • Entity + Credit + Documentation • Tier A guarantee
          </p>
        </div>

        <div className="mt-16 space-y-6 text-left">
          <h2 className="font-serif text-2xl font-semibold text-white">What You Get:</h2>
          <div className="space-y-4">
            {[
              "Business entity formation or optimization",
              "Credit report cleanup and positioning",
              "Lender-ready documentation package",
              "Direct access to underwriting team",
              "Tier A re-assessment upon completion",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                <p className="text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
