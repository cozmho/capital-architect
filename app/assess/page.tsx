"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processAssessment } from "@/app/actions/assessment";

type Step = 1 | 2 | 3;

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2 data
  const [hasEntity, setHasEntity] = useState<boolean | null>(null);
  const [entityType, setEntityType] = useState("");

  // Step 3 data
  const [inquiries, setInquiries] = useState("");
  const [errors, setErrors] = useState("");

  const canProceedStep1 = name && email && phone;
  const canProceedStep2 = hasEntity !== null && (hasEntity === false || entityType);
  const canSubmit = inquiries && errors;

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      const inquiryMap: Record<string, number> = {
        "0": 0,
        "1-2": 1,
        "3-4": 3,
        "5+": 6,
      };

      const errorMap: Record<string, number> = {
        "0": 0,
        "1-2": 1,
        "3+": 4,
        "Not sure": 2,
      };

      const result = await processAssessment({
        name,
        email,
        phone,
        hasEntity: hasEntity || false,
        entityType: hasEntity ? entityType : null,
        recentInquiries: inquiryMap[inquiries] || 0,
        metro2ErrorCount: errorMap[errors] || 0,
      });

      // Redirect based on tier
      if (result.tier === "A") {
        router.push("/assess/results/ready");
      } else if (result.tier === "B") {
        router.push("/assess/results/prep");
      } else {
        router.push("/assess/results/repair");
      }
    } catch (error) {
      console.error("Assessment error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060A14] px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#C8A84B]">
            Fundability Assessment
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            3-minute evaluation • Instant tier routing • No cost
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-16 rounded-full ${
                  s <= step ? "bg-[#C8A84B]" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </header>

        {step === 1 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-white">
              Let's start with the basics
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-zinc-400">Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                  placeholder="John Smith"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-zinc-400">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                  placeholder="john@example.com"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-zinc-400">Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                  placeholder="(555) 123-4567"
                  required
                />
              </label>
            </div>
            <button
              onClick={() => canProceedStep1 && setStep(2)}
              disabled={!canProceedStep1}
              className="w-full rounded-lg bg-[#C8A84B] px-6 py-4 font-semibold text-[#060A14] transition hover:bg-[#B89A42] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-white">
              Do you have a registered business entity?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setHasEntity(true)}
                className={`flex-1 rounded-lg border-2 px-6 py-4 font-semibold transition ${
                  hasEntity === true
                    ? "border-[#C8A84B] bg-[#C8A84B]/10 text-[#C8A84B]"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setHasEntity(false);
                  setEntityType("");
                }}
                className={`flex-1 rounded-lg border-2 px-6 py-4 font-semibold transition ${
                  hasEntity === false
                    ? "border-[#C8A84B] bg-[#C8A84B]/10 text-[#C8A84B]"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                No
              </button>
            </div>
            {hasEntity && (
              <label className="block">
                <span className="text-sm text-zinc-400">Entity Type</span>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                  required
                >
                  <option value="">Select type</option>
                  <option value="LLC">LLC</option>
                  <option value="Private Trust">Private Trust</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Sole Prop">Sole Proprietorship</option>
                </select>
              </label>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                onClick={() => canProceedStep2 && setStep(3)}
                disabled={!canProceedStep2}
                className="flex-1 rounded-lg bg-[#C8A84B] px-6 py-4 font-semibold text-[#060A14] transition hover:bg-[#B89A42] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-white">
              Final questions about your credit profile
            </h2>
            <label className="block">
              <span className="text-sm text-zinc-400">
                How many times has your credit been pulled in the last 6 months?
              </span>
              <select
                value={inquiries}
                onChange={(e) => setInquiries(e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                required
              >
                <option value="">Select one</option>
                <option value="0">0</option>
                <option value="1-2">1-2</option>
                <option value="3-4">3-4</option>
                <option value="5+">5+</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-zinc-400">
                How many errors or negative items are on your business credit report?
              </span>
              <select
                value={errors}
                onChange={(e) => setErrors(e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none ring-[#C8A84B]/40 transition focus:ring-2"
                required
              >
                <option value="">Select one</option>
                <option value="0">0</option>
                <option value="1-2">1-2</option>
                <option value="3+">3+</option>
                <option value="Not sure">Not sure</option>
              </select>
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex-1 rounded-lg bg-[#C8A84B] px-6 py-4 font-semibold text-[#060A14] transition hover:bg-[#B89A42] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Get My Results"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
