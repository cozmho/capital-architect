"use client";
import { useState } from "react";
import { submitLeadMagnet } from "@/app/actions/leads";

export default function LeadMagnet() {
  const [form, setForm] = useState({ name: "", email: "", business: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitLeadMagnet(form);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Lead magnet error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="magnet" id="resources">
      <div className="magnet-inner">
        <div className="magnet-left">
          <div className="section-eyebrow">Free Resource</div>
          <h2>Download the Free Fundability Blueprint</h2>
          <ul className="magnet-list">
            <li>Understand exactly how lenders score your credit profile</li>
            <li>Learn what Metro 2 errors are — and how to eliminate them</li>
            <li>Discover the three-tier capital stack and where you fit</li>
            <li>See the entity structures that unlock premium lending products</li>
          </ul>
        </div>
        <div className="magnet-right">
          <h3>Get the Blueprint</h3>
          <p>Instant download. No spam. Just institutional-grade intel, free.</p>
          {submitted ? (
            <div className="bg-[#C8A84B]/10 border border-[#C8A84B]/25 rounded-lg p-6 text-center">
              <p className="text-[#C8A84B] font-semibold mb-2">Check your inbox!</p>
              <p className="form-note">Your blueprint link has been sent to {form.email}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                className="form-field"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="form-field"
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="form-field"
                type="text"
                name="business"
                placeholder="Business name (optional)"
                value={form.business}
                onChange={handleChange}
              />
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button 
                className="form-submit" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Me the Blueprint"}
              </button>
            </form>
          )}
          <p className="form-note">We don't sell lists. We're not built that way.</p>
        </div>
      </div>
    </section>
  );
}
