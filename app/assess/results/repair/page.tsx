import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function RepairPage() {
  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-500/20 p-6">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-white md:text-6xl">
          Not Yet
        </h1>
        <p className="mt-4 text-2xl font-light text-red-400">— but fixable.</p>

        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
          <p className="text-lg text-zinc-300">
            Your credit profile needs repair before pursuing funding. Good news: this is a solved problem.
          </p>
          <p className="mt-4 text-zinc-400">
            Follow the DIY playbook or work with our credit optimization partners. Either way, you&apos;ll be back in 60-90 days ready for Tier B.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href="https://gumroad.com/placeholder"
            target="_blank"
            className="inline-block w-full rounded-lg bg-red-500 px-8 py-5 text-lg font-semibold text-white transition hover:bg-red-600"
          >
            Get the DIY Credit Repair Guide
          </Link>
          <p className="text-sm text-zinc-500">
            $47 • Step-by-step disputation process • Letter templates included
          </p>
        </div>

        <div className="mt-16 space-y-6 text-left">
          <h2 className="font-serif text-2xl font-semibold text-white">What&apos;s Inside:</h2>
          <div className="space-y-4">
            {[
              "How to pull and audit your credit reports (all 3 bureaus)",
              "Proven disputation letter templates",
              "Timeline and milestones for a 90-day cleanup",
              "When to use a credit repair agency vs. DIY",
              "Re-assessment checklist for when you&apos;re ready",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                <p className="text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
          <p className="font-semibold text-zinc-200">Come back when you&apos;re ready.</p>
          <p className="mt-2">
            Re-take this assessment once your credit is cleaned up. We&apos;ll still be here, and funding will still be waiting.
          </p>
        </div>
      </div>
    </main>
  );
}
