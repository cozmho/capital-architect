import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ReadyPage() {
  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-[#C8A84B]/20 p-6">
            <CheckCircle2 className="h-16 w-16 text-[#C8A84B]" />
          </div>
        </div>

        <h1 className="font-serif text-5xl font-bold text-[#C8A84B] md:text-6xl">
          You&apos;re Fundable.
        </h1>
        <p className="mt-4 text-2xl font-light text-white">Let&apos;s move.</p>

        <div className="mt-8 rounded-2xl border border-[#C8A84B]/30 bg-[#C8A84B]/5 p-8">
          <p className="text-lg text-zinc-300">
            Your profile clears our underwriting criteria. You&apos;re ready for capital deployment.
          </p>
          <p className="mt-4 text-zinc-400">
            Next step: strategy call to map your funding stack and lock in terms.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href="https://calendly.com/placeholder"
            target="_blank"
            className="inline-block w-full rounded-lg bg-[#C8A84B] px-8 py-5 text-lg font-semibold text-[#060A14] transition hover:bg-[#B89A42]"
          >
            Book Your Strategy Call
          </Link>
          <p className="text-sm text-zinc-500">
            15-minute call • No pitch • Pure execution planning
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-3xl font-bold text-[#C8A84B]">Tier A</p>
            <p className="mt-2 text-sm text-zinc-400">Ready for Funding</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-3xl font-bold text-white">$50K-$250K</p>
            <p className="mt-2 text-sm text-zinc-400">Typical First Round</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-3xl font-bold text-white">7-14 Days</p>
            <p className="mt-2 text-sm text-zinc-400">Deployment Timeline</p>
          </div>
        </div>
      </div>
    </main>
  );
}
