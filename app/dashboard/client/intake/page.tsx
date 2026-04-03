"use client";

import { useState } from "react";
import { processIntake } from "@/app/actions/scoring";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export default function ClientIntakePage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [recentInquiries, setRecentInquiries] = useState("");
  const [metro2ErrorCount, setMetro2ErrorCount] = useState("");
  const [entityType, setEntityType] = useState("");

  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  const canSubmit =
    businessName && recentInquiries && metro2ErrorCount && entityType && submissionState !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmissionState("submitting");
    setMessage("");

    try {
      await processIntake({
        businessName,
        email: email || undefined,
        phone: phone || undefined,
        recentInquiries: parseInt(recentInquiries, 10),
        metro2ErrorCount: parseInt(metro2ErrorCount, 10),
        entityType,
      });
    } catch (error) {
      setSubmissionState("error");
      setMessage(error instanceof Error ? error.message : "Failed to submit intake");
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-8">
        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Client Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Underwriting Intake</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Submit your business information for fundability scoring and tier assignment.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Business Name *</span>
            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Email</span>
              <input
                type="email"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Phone</span>
              <input
                type="tel"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Recent Inquiries *</span>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
              value={recentInquiries}
              onChange={(e) => setRecentInquiries(e.target.value)}
              placeholder="Number of recent credit inquiries"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Metro 2 Error Count *</span>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
              value={metro2ErrorCount}
              onChange={(e) => setMetro2ErrorCount(e.target.value)}
              placeholder="Number of Metro 2 errors"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Entity Type *</span>
            <select
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-cyan-400/40 transition focus:ring"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              required
            >
              <option value="">Select entity type</option>
              <option value="LLC">LLC</option>
              <option value="Private Trust">Private Trust</option>
              <option value="Sole Proprietor">Sole Proprietor</option>
              <option value="Corporation">Corporation</option>
              <option value="No Entity">No Entity</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submissionState === "submitting" ? "Submitting..." : "Submit for Underwriting"}
          </button>
        </form>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              submissionState === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : submissionState === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "border-zinc-700 bg-zinc-800/60 text-zinc-300"
            }`}
          >
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
