"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  calculateVerdicScore,
  BusinessFormData,
  PreBusinessFormData,
} from "@/app/actions/verdic";

type PathType = "business" | "pre-business" | null;

interface FieldError {
  [key: string]: string;
}

// ============================================================================
// INITIAL FORM STATE
// ============================================================================
const INITIAL_BUSINESS: Omit<BusinessFormData, "path"> = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  businessType: "",
  industry: "",
  revenueRange: "",
  monthlyRevenue: "",
  businessGoal: "",
  referralSource: "",
  creditScoreRange: "",
  hasMetro2Errors: "",
  hardInquiries: "",
  hasCollections: "",
  hasBankruptcy: "",
  isAuthorizedUser: "",
  oldestAccountAge: "",
  creditUtilization: "",
  businessAge: "",
  hasBusinessBank: "",
  hasEIN: "",
  existingBusinessCredit: "",
  deniedFunding: "",
  hasDUNS: "",
  addressType: "",
  hasOpenBusinessLoans: "",
  hasFiledBusinessTaxes: "",
  capitalTarget: "",
  fundingTimeline: "",
  biggestObstacle: "",
  workedWithCompanyBefore: "",
};

const INITIAL_PREBIZ: Omit<PreBusinessFormData, "path"> = {
  fullName: "",
  email: "",
  phone: "",
  buildingToward: "",
  referralSource: "",
  creditScoreRange: "",
  hasMetro2Errors: "",
  hardInquiries: "",
  hasCollections: "",
  hasBankruptcy: "",
  oldestAccountAge: "",
  creditUtilization: "",
  isAuthorizedUser: "",
  hasEIN: "",
  hasBusinessBank: "",
  hasBusinessName: "",
  capitalTarget: "",
  biggestObstacle: "",
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function AssessPage() {
  const router = useRouter();
  const [path, setPath] = useState<PathType>(null);
  const [step, setStep] = useState(0); // 0 = path selector
  const [bizForm, setBizForm] = useState(INITIAL_BUSINESS);
  const [preForm, setPreForm] = useState(INITIAL_PREBIZ);
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = path === "business" ? 4 : 3;

  // ---------------------------------------------------------------
  // Field update helpers
  // ---------------------------------------------------------------
  const updateBiz = (field: string, value: string) => {
    setBizForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updatePre = (field: string, value: string) => {
    setPreForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  // ---------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------
  const validateStep = (): boolean => {
    const errs: FieldError = {};

    if (path === "business") {
      if (step === 1) {
        if (!bizForm.fullName.trim()) errs.fullName = "Name is required.";
        if (!bizForm.email.trim()) errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bizForm.email)) errs.email = "Enter a valid email.";
        if (!bizForm.businessName.trim()) errs.businessName = "Business name is required.";
        if (!bizForm.businessType) errs.businessType = "Select your business type.";
        if (!bizForm.revenueRange) errs.revenueRange = "Select your revenue range.";
        if (!bizForm.monthlyRevenue) errs.monthlyRevenue = "Select monthly revenue.";
        if (!bizForm.businessGoal) errs.businessGoal = "Select a goal.";
      } else if (step === 2) {
        if (!bizForm.creditScoreRange) errs.creditScoreRange = "Select your credit score range.";
        if (!bizForm.hasMetro2Errors) errs.hasMetro2Errors = "Select an option.";
        if (!bizForm.hardInquiries) errs.hardInquiries = "Select an option.";
        if (!bizForm.hasCollections) errs.hasCollections = "Select an option.";
        if (!bizForm.hasBankruptcy) errs.hasBankruptcy = "Select an option.";
        if (!bizForm.isAuthorizedUser) errs.isAuthorizedUser = "Select an option.";
        if (!bizForm.oldestAccountAge) errs.oldestAccountAge = "Select an option.";
        if (!bizForm.creditUtilization) errs.creditUtilization = "Select an option.";
      } else if (step === 3) {
        if (!bizForm.businessAge) errs.businessAge = "Select business age.";
        if (!bizForm.hasBusinessBank) errs.hasBusinessBank = "Select an option.";
        if (!bizForm.hasEIN) errs.hasEIN = "Select an option.";
        if (!bizForm.existingBusinessCredit) errs.existingBusinessCredit = "Select an option.";
        if (!bizForm.deniedFunding) errs.deniedFunding = "Select an option.";
        if (!bizForm.hasDUNS) errs.hasDUNS = "Select an option.";
        if (!bizForm.addressType) errs.addressType = "Select an option.";
        if (!bizForm.hasOpenBusinessLoans) errs.hasOpenBusinessLoans = "Select an option.";
        if (!bizForm.hasFiledBusinessTaxes) errs.hasFiledBusinessTaxes = "Select an option.";
      } else if (step === 4) {
        if (!bizForm.capitalTarget) errs.capitalTarget = "Select a target.";
        if (!bizForm.fundingTimeline) errs.fundingTimeline = "Select a timeline.";
        if (!bizForm.workedWithCompanyBefore) errs.workedWithCompanyBefore = "Select an option.";
      }
    } else {
      if (step === 1) {
        if (!preForm.fullName.trim()) errs.fullName = "Name is required.";
        if (!preForm.email.trim()) errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(preForm.email)) errs.email = "Enter a valid email.";
        if (!preForm.buildingToward) errs.buildingToward = "Select an option.";
      } else if (step === 2) {
        if (!preForm.creditScoreRange) errs.creditScoreRange = "Select your credit score range.";
        if (!preForm.hasMetro2Errors) errs.hasMetro2Errors = "Select an option.";
        if (!preForm.hardInquiries) errs.hardInquiries = "Select an option.";
        if (!preForm.hasCollections) errs.hasCollections = "Select an option.";
        if (!preForm.hasBankruptcy) errs.hasBankruptcy = "Select an option.";
        if (!preForm.oldestAccountAge) errs.oldestAccountAge = "Select an option.";
        if (!preForm.creditUtilization) errs.creditUtilization = "Select an option.";
        if (!preForm.isAuthorizedUser) errs.isAuthorizedUser = "Select an option.";
      } else if (step === 3) {
        if (!preForm.hasEIN) errs.hasEIN = "Select an option.";
        if (!preForm.hasBusinessBank) errs.hasBusinessBank = "Select an option.";
        if (!preForm.hasBusinessName) errs.hasBusinessName = "Select an option.";
        if (!preForm.capitalTarget) errs.capitalTarget = "Select a target.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------
  const selectPath = (p: PathType) => {
    setPath(p);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setPath(null);
      setStep(0);
    } else {
      setStep((s) => s - 1);
    }
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      const formData =
        path === "business"
          ? ({ ...bizForm, path: "business" } as BusinessFormData)
          : ({ ...preForm, path: "pre-business" } as PreBusinessFormData);

      const result = await calculateVerdicScore(formData);

      sessionStorage.setItem(
        "verdicResult",
        JSON.stringify({
          score: result.score,
          tier: result.tier,
          hasMetro2Errors: result.hasMetro2Errors,
          path: result.path,
          leadId: result.leadId,
          fullName: path === "business" ? bizForm.fullName : preForm.fullName,
          email: path === "business" ? bizForm.email : preForm.email,
          businessName: path === "business" ? bizForm.businessName : "",
        })
      );

      router.push(`/assess/results/${result.route}`);
    } catch (error) {
      console.error("Verdic scoring failed:", error);
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------
  const renderInput = (
    form: "biz" | "pre",
    field: string,
    label: string,
    type = "text",
    placeholder = "",
    required = true
  ) => {
    const value = form === "biz" ? (bizForm as Record<string, string>)[field] : (preForm as Record<string, string>)[field];
    const update = form === "biz" ? updateBiz : updatePre;
    return (
      <div className="intake-field">
        <label htmlFor={`intake-${field}`}>
          {label}
          {!required && <span className="field-optional">Optional</span>}
        </label>
        <input
          id={`intake-${field}`}
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => update(field, e.target.value)}
          className={errors[field] ? "field-error" : ""}
        />
        {errors[field] && <p className="intake-error">{errors[field]}</p>}
      </div>
    );
  };

  const renderTextarea = (
    form: "biz" | "pre",
    field: string,
    label: string,
    placeholder = "",
    required = false
  ) => {
    const value = form === "biz" ? (bizForm as Record<string, string>)[field] : (preForm as Record<string, string>)[field];
    const update = form === "biz" ? updateBiz : updatePre;
    return (
      <div className="intake-field">
        <label htmlFor={`intake-${field}`}>
          {label}
          {!required && <span className="field-optional">Optional</span>}
        </label>
        <textarea
          id={`intake-${field}`}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => update(field, e.target.value.slice(0, 280))}
          maxLength={280}
          rows={3}
        />
        {errors[field] && <p className="intake-error">{errors[field]}</p>}
      </div>
    );
  };

  const renderSelect = (
    form: "biz" | "pre",
    field: string,
    label: string,
    options: { value: string; label: string }[]
  ) => {
    const value = form === "biz" ? (bizForm as Record<string, string>)[field] : (preForm as Record<string, string>)[field];
    const update = form === "biz" ? updateBiz : updatePre;
    return (
      <div className="intake-field">
        <label htmlFor={`intake-${field}`}>{label}</label>
        <select
          id={`intake-${field}`}
          value={value || ""}
          onChange={(e) => update(field, e.target.value)}
          className={errors[field] ? "field-error" : ""}
        >
          <option value="">Select...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors[field] && <p className="intake-error">{errors[field]}</p>}
      </div>
    );
  };

  const renderRadio = (
    form: "biz" | "pre",
    field: string,
    label: string,
    options: { value: string; label: string }[]
  ) => {
    const value = form === "biz" ? (bizForm as Record<string, string>)[field] : (preForm as Record<string, string>)[field];
    const update = form === "biz" ? updateBiz : updatePre;
    return (
      <div className="intake-field">
        <label>{label}</label>
        <div className="radio-group">
          {options.map((o) => (
            <label key={o.value} className={`radio-option ${value === o.value ? "selected" : ""}`}>
              <input type="radio" name={field} value={o.value} checked={value === o.value} onChange={() => update(field, o.value)} />
              <span className="radio-label">{o.label}</span>
            </label>
          ))}
        </div>
        {errors[field] && <p className="intake-error">{errors[field]}</p>}
      </div>
    );
  };

  // Shared dropdowns
  const CREDIT_SCORE_OPTIONS = [
    { value: "750+", label: "750+" },
    { value: "700-749", label: "700 – 749" },
    { value: "650-699", label: "650 – 699" },
    { value: "600-649", label: "600 – 649" },
    { value: "below-600", label: "Below 600" },
    { value: "not-sure", label: "Not Sure" },
  ];
  const INQUIRY_OPTIONS = [
    { value: "0", label: "0" },
    { value: "1-2", label: "1 – 2" },
    { value: "3-5", label: "3 – 5" },
    { value: "6-10", label: "6 – 10" },
    { value: "10+", label: "10+" },
  ];
  const ACCOUNT_AGE_OPTIONS = [
    { value: "less-1", label: "Less than 1 year" },
    { value: "1-3", label: "1 – 3 years" },
    { value: "3-7", label: "3 – 7 years" },
    { value: "7-10", label: "7 – 10 years" },
    { value: "10+", label: "10+ years" },
  ];
  const UTILIZATION_OPTIONS = [
    { value: "under-10", label: "Under 10%" },
    { value: "10-30", label: "10 – 30%" },
    { value: "30-50", label: "30 – 50%" },
    { value: "50-75", label: "50 – 75%" },
    { value: "over-75", label: "Over 75%" },
    { value: "not-sure", label: "Not Sure" },
  ];
  const CAPITAL_OPTIONS = [
    { value: "under-25k", label: "Under $25K" },
    { value: "25k-75k", label: "$25K – $75K" },
    { value: "75k-150k", label: "$75K – $150K" },
    { value: "150k-500k", label: "$150K – $500K" },
    { value: "500k+", label: "$500K+" },
  ];
  const YES_NO = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  const YES_NO_NOTSURE = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not-sure", label: "Not Sure" },
  ];
  const REFERRAL_OPTIONS = [
    { value: "google", label: "Google" },
    { value: "instagram", label: "Instagram" },
    { value: "referral", label: "Referral" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
    { value: "other", label: "Other" },
  ];

  // ---------------------------------------------------------------
  // Progress bar labels
  // ---------------------------------------------------------------
  const getProgressLabels = () => {
    if (path === "business") {
      return ["Your Business", "Credit Profile", "Entity & Structure", "Goals & Timeline"];
    }
    return ["About You", "Credit Profile", "Readiness"];
  };

  const isLastStep = step === totalSteps;

  // ===============================================================
  // RENDER
  // ===============================================================
  return (
    <div className="intake-container">
      {/* ------------------------------------------------
          STEP 0 — PATH SELECTOR
      ------------------------------------------------ */}
      {step === 0 && (
        <>
          <div className="path-selector-header">
            <div className="section-eyebrow">FREE ASSESSMENT</div>
            <h1>Let&apos;s start with where you are.</h1>
            <p className="step-sub">
              This helps us build your Verdic™ score with the right framework. Pick the option that fits.
            </p>
          </div>

          <div className="path-cards">
            <button className="path-card" onClick={() => selectPath("business")}>
              <div className="path-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="11" x2="12" y2="15" />
                  <line x1="10" y1="13" x2="14" y2="13" />
                </svg>
              </div>
              <h2>I have a business</h2>
              <p>LLC, S-Corp, Sole Prop, or operating entity</p>
              <span className="path-arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <button className="path-card" onClick={() => selectPath("pre-business")}>
              <div className="path-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <path d="M12 14v4" />
                  <path d="M10 16h4" />
                </svg>
              </div>
              <h2>I&apos;m pre-business</h2>
              <p>Side income, idea stage, or personal credit focus</p>
              <span className="path-arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </>
      )}

      {/* ------------------------------------------------
          FORM STEPS (step >= 1)
      ------------------------------------------------ */}
      {step >= 1 && (
        <>
          {/* Progress Bar */}
          <div className="intake-progress">
            <div className="progress-steps">
              {getProgressLabels().map((label, i) => {
                const s = i + 1;
                return (
                  <div key={s} className={`progress-step ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}>
                    <div className="progress-dot">
                      {step > s ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : s}
                    </div>
                    <span className="progress-label">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
            </div>
          </div>

          <div className="intake-card">
            <form onSubmit={handleSubmit} noValidate>

              {/* ==========================
                  BUSINESS PATH
              ========================== */}
              {path === "business" && (
                <>
                  {step === 1 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 1 OF 4</div>
                        <h1>Tell us about you and your business.</h1>
                        <p className="step-sub">This helps us understand your current position and match you to the right funding tier.</p>
                      </div>
                      <div className="intake-fields">
                        {renderInput("biz", "fullName", "Full Name", "text", "Your full name")}
                        <div className="field-row">
                          {renderInput("biz", "email", "Email", "email", "you@company.com")}
                          {renderInput("biz", "phone", "Phone", "tel", "(555) 123-4567", false)}
                        </div>
                        {renderInput("biz", "businessName", "Business Name", "text", "Your business name")}
                        <div className="field-row">
                          {renderSelect("biz", "businessType", "Business Entity Type", [
                            { value: "llc", label: "LLC" },
                            { value: "s-corp", label: "S-Corp" },
                            { value: "c-corp", label: "C-Corp" },
                            { value: "sole-proprietorship", label: "Sole Proprietorship" },
                            { value: "partnership", label: "Partnership" },
                            { value: "not-formed", label: "Not Yet Formed" },
                          ])}
                          {renderSelect("biz", "revenueRange", "Annual Revenue", [
                            { value: "pre-revenue", label: "Pre-revenue" },
                            { value: "under-50k", label: "Under $50K" },
                            { value: "50k-150k", label: "$50K – $150K" },
                            { value: "150k-500k", label: "$150K – $500K" },
                            { value: "500k-1m", label: "$500K – $1M" },
                            { value: "1m+", label: "$1M+" },
                          ])}
                        </div>
                        {renderSelect("biz", "monthlyRevenue", "Monthly Average Revenue", [
                          { value: "inconsistent", label: "Inconsistent" },
                          { value: "under-5k", label: "Under $5K" },
                          { value: "5k-15k", label: "$5K – $15K" },
                          { value: "15k-50k", label: "$15K – $50K" },
                          { value: "50k+", label: "$50K+" },
                        ])}
                        {renderSelect("biz", "businessGoal", "Primary Business Goal", [
                          { value: "working-capital", label: "Access working capital" },
                          { value: "equipment", label: "Purchase equipment" },
                          { value: "real-estate", label: "Real estate" },
                          { value: "hire-staff", label: "Hire staff" },
                          { value: "scale-marketing", label: "Scale marketing" },
                          { value: "survive-slow", label: "Survive a slow period" },
                        ])}
                        {renderInput("biz", "industry", "Industry", "text", "e.g. E-commerce, Construction, SaaS", false)}
                        {renderSelect("biz", "referralSource", "How did you hear about us?", REFERRAL_OPTIONS)}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 2 OF 4</div>
                        <h1>Your credit profile.</h1>
                        <p className="step-sub">We evaluate the same factors lenders do — this is how Verdic™ builds your fundability score.</p>
                      </div>
                      <div className="intake-fields">
                        {renderSelect("biz", "creditScoreRange", "Personal Credit Score Range", CREDIT_SCORE_OPTIONS)}
                        {renderRadio("biz", "hasMetro2Errors", "Any Metro 2 errors on your credit report?", YES_NO_NOTSURE)}
                        {renderSelect("biz", "hardInquiries", "Hard inquiries in the last 6 months", INQUIRY_OPTIONS)}
                        {renderRadio("biz", "hasCollections", "Any collections or charge-offs?", YES_NO)}
                        {renderRadio("biz", "hasBankruptcy", "Any bankruptcies in the last 7 years?", YES_NO)}
                        {renderRadio("biz", "isAuthorizedUser", "Are you an authorized user on any accounts?", YES_NO)}
                        {renderSelect("biz", "oldestAccountAge", "Oldest credit account age", ACCOUNT_AGE_OPTIONS)}
                        {renderSelect("biz", "creditUtilization", "Current credit utilization estimate", UTILIZATION_OPTIONS)}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 3 OF 4</div>
                        <h1>Entity &amp; business structure.</h1>
                        <p className="step-sub">Your business infrastructure tells lenders whether you&apos;re ready for capital — or still building the foundation.</p>
                      </div>
                      <div className="intake-fields">
                        {renderSelect("biz", "businessAge", "How long has your business been operating?", [
                          { value: "not-started", label: "Not started yet" },
                          { value: "less-than-1", label: "Less than 1 year" },
                          { value: "1-2", label: "1 – 2 years" },
                          { value: "3-5", label: "3 – 5 years" },
                          { value: "5+", label: "5+ years" },
                        ])}
                        {renderRadio("biz", "hasBusinessBank", "Do you have a business bank account?", YES_NO)}
                        {renderRadio("biz", "hasEIN", "Do you have an EIN?", YES_NO)}
                        {renderSelect("biz", "existingBusinessCredit", "Existing business credit accounts?", [
                          { value: "multiple", label: "Yes, multiple" },
                          { value: "1-2", label: "Yes, 1 – 2" },
                          { value: "none", label: "No" },
                        ])}
                        {renderRadio("biz", "deniedFunding", "Denied business funding in the last 12 months?", YES_NO)}
                        {renderRadio("biz", "hasDUNS", "Do you have a DUNS/Tradeline with Dun & Bradstreet?", YES_NO_NOTSURE)}
                        {renderSelect("biz", "addressType", "Is your business address a home address or commercial?", [
                          { value: "home", label: "Home" },
                          { value: "commercial", label: "Commercial" },
                          { value: "virtual-office", label: "Virtual Office" },
                          { value: "po-box", label: "PO Box" },
                        ])}
                        {renderRadio("biz", "hasOpenBusinessLoans", "Any open business loans or lines of credit?", YES_NO)}
                        {renderRadio("biz", "hasFiledBusinessTaxes", "Filed business taxes in the last 2 years?", [
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "not-applicable", label: "Not applicable" },
                        ])}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 4 OF 4</div>
                        <h1>Goals &amp; timeline.</h1>
                        <p className="step-sub">Last step — this helps us prioritize your roadmap and match you to the right capital products.</p>
                      </div>
                      <div className="intake-fields">
                        {renderSelect("biz", "capitalTarget", "How much capital are you looking to access?", CAPITAL_OPTIONS)}
                        {renderSelect("biz", "fundingTimeline", "Target timeline to funding", [
                          { value: "asap", label: "ASAP" },
                          { value: "30-60", label: "30 – 60 days" },
                          { value: "3-6m", label: "3 – 6 months" },
                          { value: "6-12m", label: "6 – 12 months" },
                          { value: "exploring", label: "Just exploring" },
                        ])}
                        {renderTextarea("biz", "biggestObstacle", "What's the biggest obstacle you're facing?", "Tell us what's standing between you and capital...")}
                        {renderRadio("biz", "workedWithCompanyBefore", "Worked with a credit repair or funding company before?", [
                          { value: "yes-didnt-work", label: "Yes — didn't work" },
                          { value: "yes-helped", label: "Yes — helped some" },
                          { value: "no", label: "No" },
                        ])}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ==========================
                  PRE-BUSINESS PATH
              ========================== */}
              {path === "pre-business" && (
                <>
                  {step === 1 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 1 OF 3</div>
                        <h1>Tell us about you.</h1>
                        <p className="step-sub">Even without a business entity, your credit profile and readiness matter. Let&apos;s see where you stand.</p>
                      </div>
                      <div className="intake-fields">
                        {renderInput("pre", "fullName", "Full Name", "text", "Your full name")}
                        <div className="field-row">
                          {renderInput("pre", "email", "Email", "email", "you@example.com")}
                          {renderInput("pre", "phone", "Phone", "tel", "(555) 123-4567", false)}
                        </div>
                        {renderSelect("pre", "buildingToward", "What are you building toward?", [
                          { value: "start-6mo", label: "Start a business in next 6 months" },
                          { value: "side-income", label: "Already earning side income" },
                          { value: "credit-first", label: "Cleaning up personal credit first" },
                          { value: "exploring", label: "Not sure yet — exploring options" },
                        ])}
                        {renderSelect("pre", "referralSource", "How did you hear about us?", REFERRAL_OPTIONS)}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 2 OF 3</div>
                        <h1>Your personal credit profile.</h1>
                        <p className="step-sub">Your personal credit is the foundation everything else is built on. Let&apos;s assess it honestly.</p>
                      </div>
                      <div className="intake-fields">
                        {renderSelect("pre", "creditScoreRange", "Personal Credit Score Range", CREDIT_SCORE_OPTIONS)}
                        {renderRadio("pre", "hasMetro2Errors", "Any Metro 2 errors on your personal credit report?", YES_NO_NOTSURE)}
                        {renderSelect("pre", "hardInquiries", "Hard inquiries in the last 6 months", INQUIRY_OPTIONS)}
                        {renderRadio("pre", "hasCollections", "Any collections or charge-offs?", YES_NO)}
                        {renderRadio("pre", "hasBankruptcy", "Any bankruptcies in the last 7 years?", YES_NO)}
                        {renderSelect("pre", "oldestAccountAge", "Oldest credit account age", ACCOUNT_AGE_OPTIONS)}
                        {renderSelect("pre", "creditUtilization", "Current credit utilization estimate", UTILIZATION_OPTIONS)}
                        {renderRadio("pre", "isAuthorizedUser", "Are you an authorized user on any accounts?", YES_NO)}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="intake-step">
                      <div className="step-header">
                        <div className="section-eyebrow">STEP 3 OF 3</div>
                        <h1>Your readiness.</h1>
                        <p className="step-sub">A few quick questions about how prepared you are to start building your business foundation.</p>
                      </div>
                      <div className="intake-fields">
                        {renderRadio("pre", "hasEIN", "Do you have an EIN yet?", [
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "whats-that", label: "What's that?" },
                        ])}
                        {renderRadio("pre", "hasBusinessBank", "Do you have a business bank account?", YES_NO)}
                        {renderRadio("pre", "hasBusinessName", "Do you have a business name chosen?", YES_NO)}
                        {renderSelect("pre", "capitalTarget", "Target capital amount when ready", CAPITAL_OPTIONS)}
                        {renderTextarea("pre", "biggestObstacle", "Biggest obstacle right now", "What's standing between you and getting started?")}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Navigation buttons */}
              {step >= 1 && (
                <div className="intake-actions">
                  <button type="button" className="btn-ghost" onClick={handleBack}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  {isLastStep ? (
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? (
                        <><span className="spinner" /> Calculating Your Verdic Score...</>
                      ) : (
                        <>
                          Get Your Verdic™ Score
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={handleNext}>
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Trust footer */}
          <div className="intake-trust">
            <span className="trust-item">
              <span className="trust-dot" />
              256-bit Encrypted
            </span>
            <span className="trust-item">
              <span className="trust-dot" />
              FCRA-Compliant
            </span>
            <span className="trust-item">
              <span className="trust-dot" />
              No Credit Pull Required
            </span>
          </div>
        </>
      )}
    </div>
  );
}
