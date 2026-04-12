"use client";

import { useState, FormEvent } from "react";

interface FormErrors {
  name?: string;
  email?: string;
}

export default function LeadMagnetForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // TODO: wire to /api/blueprint-signup
    const formData = { name, email, business };
    console.log("Lead magnet form submitted:", formData);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="form-card">
        <div className="form-success">
          <div className="form-success-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="form-success-msg">Blueprint sent to {email}!</p>
          <p className="form-success-sub">
            Check your inbox. In the meantime, start your free assessment.
          </p>
          <a href="/intake" className="btn-outline-gold">
            Start Your Free Assessment
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>Get the Blueprint</h3>
      <p className="form-sub">
        Instant access. No spam. Institutional-grade intel, free.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="lead-name">Name</label>
          <input
            id="lead-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            required
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lead-email">Email</label>
          <input
            id="lead-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            required
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lead-business">Business name (optional)</label>
          <input
            id="lead-business"
            type="text"
            placeholder="Your business name"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "Sending..." : "Send Me the Blueprint"}
        </button>
        <p className="form-fine">
          We don&apos;t sell lists. We&apos;re not built that way.
        </p>
      </form>
    </div>
  );
}
