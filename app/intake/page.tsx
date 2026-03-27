"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type SubmissionState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialSubmissionState: SubmissionState = {
  status: "idle",
  message: "",
};

export default function IntakePage() {
  const [leadName, setLeadName] = useState("");
  const [ficoBand, setFicoBand] = useState("");
  const [utilizationBand, setUtilizationBand] = useState("");
  const [bankruptcy, setBankruptcy] = useState("");
  const [recentLates, setRecentLates] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>(initialSubmissionState);

  const canSubmit = useMemo(() => {
    return Boolean(leadName && ficoBand && utilizationBand && bankruptcy && recentLates);
  }, [leadName, ficoBand, utilizationBand, bankruptcy, recentLates]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmission({ status: "submitting", message: "Submitting your intake..." });

    const payload = {
      leadName,
      ficoBand,
      utilizationBand,
      bankruptcy,
      recentLates,
      source: "website",
      sourceLeadId: `website|${leadName}|${Date.now()}`,
    };

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { assignedTier?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      const tierMessage = data.assignedTier ? `Assigned Tier: ${data.assignedTier}` : "Submission complete.";
      setSubmission({
        status: "success",
        message: `Thank you. Your intake has been received. ${tierMessage}`,
      });
      setLeadName("");
      setFicoBand("");
      setUtilizationBand("");
      setBankruptcy("");
      setRecentLates("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected submission error";
      setSubmission({
        status: "error",
        message,
      });
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-8">
        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Funding Intake</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Complete this intake to receive your qualification track. Responses flow directly into our underwriting system.
          </p>
        </header>

        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Lead Name</span>
            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
              value={leadName}
              onChange={(event) => setLeadName(event.target.value)}
              placeholder="Business owner or company name"
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">FICO Band</span>
              <select
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={ficoBand}
                onChange={(event) => setFicoBand(event.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="Under 620">Under 620</option>
                <option value="620-679">620-679</option>
                <option value="680-719">680-719</option>
                <option value="720+">720+</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Utilization Band</span>
              <select
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={utilizationBand}
                onChange={(event) => setUtilizationBand(event.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="0-30%">0-30%</option>
                <option value="31-50%">31-50%</option>
                <option value="51-80%">51-80%</option>
                <option value="Maxed out">Maxed out</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Any prior bankruptcy?</span>
              <select
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={bankruptcy}
                onChange={(event) => setBankruptcy(event.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Recent late payments?</span>
              <select
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={recentLates}
                onChange={(event) => setRecentLates(event.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submission.status === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submission.status === "submitting" ? "Submitting..." : "Submit Intake"}
          </button>
        </form>

        {submission.message ? (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              submission.status === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : submission.status === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "border-zinc-700 bg-zinc-800/60 text-zinc-300"
            }`}
          >
            {submission.message}
          </div>
        ) : null}

        <Link href="/" className="text-sm text-zinc-400 transition hover:text-zinc-200">
          Back to home
        </Link>
      </section>
    </main>
  );
}
