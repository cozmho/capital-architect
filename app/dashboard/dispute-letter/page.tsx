"use client";

import { useState } from "react";

interface LetterData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn4: string;
  dob: string;
  bureau: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  explanation: string;
}

const INITIAL: LetterData = {
  fullName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  ssn4: "",
  dob: "",
  bureau: "equifax",
  accountName: "",
  accountNumber: "",
  errorType: "late-payment",
  explanation: "",
};

const BUREAU_ADDRESSES: Record<string, { name: string; address: string }> = {
  equifax: {
    name: "Equifax Information Services LLC",
    address: "P.O. Box 740256, Atlanta, GA 30374-0256",
  },
  experian: {
    name: "Experian",
    address: "P.O. Box 4500, Allen, TX 75013",
  },
  transunion: {
    name: "TransUnion LLC Consumer Dispute Center",
    address: "P.O. Box 2000, Chester, PA 19016",
  },
};

const ERROR_TYPES = [
  { value: "late-payment", label: "Late Payment Reported Inaccurately" },
  { value: "balance", label: "Incorrect Balance Reported" },
  { value: "not-mine", label: "Account Does Not Belong to Me" },
  { value: "status", label: "Incorrect Account Status" },
  { value: "duplicate", label: "Duplicate Account Reporting" },
  { value: "closed", label: "Account Reported as Open (Should Be Closed)" },
  { value: "collection", label: "Collection Account — Paid/Settled Not Updated" },
  { value: "inquiry", label: "Unauthorized Hard Inquiry" },
  { value: "personal-info", label: "Incorrect Personal Information" },
  { value: "other", label: "Other Metro 2 Error" },
];

export default function DisputeLetterPage() {
  const [form, setForm] = useState(INITIAL);
  const [generated, setGenerated] = useState<string | null>(null);

  const update = (field: keyof LetterData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateLetter = () => {
    const bureau = BUREAU_ADDRESSES[form.bureau];
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const errorLabel =
      ERROR_TYPES.find((e) => e.value === form.errorType)?.label || form.errorType;

    const letter = `${form.fullName}
${form.address}
${form.city}, ${form.state} ${form.zip}

${today}

${bureau.name}
${bureau.address}

Re: Dispute of Inaccurate Information — Request for Investigation Under FCRA § 611

Dear Dispute Department,

I am writing to formally dispute the following information appearing on my credit report, which I believe to be inaccurate, incomplete, or unverifiable under the Fair Credit Reporting Act (15 U.S.C. § 1681i).

CONSUMER INFORMATION
Name: ${form.fullName}
Date of Birth: ${form.dob}
Last 4 of SSN: ${form.ssn4}

DISPUTED ITEM
Creditor/Account Name: ${form.accountName}
Account Number (partial): ${form.accountNumber}
Type of Error: ${errorLabel}

EXPLANATION
${form.explanation || `The above item is being reported inaccurately on my credit file. Under Metro 2 reporting standards, this data does not comply with the format and accuracy requirements established by the Consumer Data Industry Association (CDIA). I am requesting that you investigate this item and either verify its accuracy with the original data furnisher or remove it from my credit report within 30 days as required by law.`}

LEGAL BASIS
Under the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into the disputed information within 30 days of receiving this notice. If the information cannot be verified, it must be deleted or modified.

Additionally, under Section 623 of the FCRA (15 U.S.C. § 1681s-2), data furnishers have a duty to report accurate information and to investigate disputes forwarded by consumer reporting agencies.

I request that you:
1. Investigate this disputed item within 30 days
2. Contact the data furnisher to verify accuracy
3. Remove or correct any unverifiable or inaccurate information
4. Provide me with written notification of the results
5. Send an updated copy of my credit report reflecting any changes

Please note that continued reporting of inaccurate information may constitute a willful violation of the FCRA, which may result in liability for actual damages, statutory damages of $100–$1,000 per violation, punitive damages, and attorney's fees under 15 U.S.C. § 1681n.

Sincerely,

${form.fullName}

Enclosures:
- Copy of government-issued identification
- Proof of address (utility bill or bank statement)
- Relevant supporting documentation`;

    setGenerated(letter);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const copyToClipboard = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
    }
  };

  const downloadLetter = () => {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispute-letter-${form.bureau}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dispute-container">
      <div className="dispute-header">
        <div className="section-eyebrow">METRO 2 DISPUTE</div>
        <h1>Generate Your Dispute Letter</h1>
        <p className="step-sub">
          Fill in the details below. We&apos;ll generate a legally-formatted FCRA
          Section 611 dispute letter you can send directly to the bureau.
        </p>
      </div>

      <div className="intake-card">
        <div className="intake-fields">
          {/* Personal Info */}
          <div className="intake-field">
            <label htmlFor="dispute-name">Full Legal Name</label>
            <input
              id="dispute-name"
              type="text"
              placeholder="As it appears on your credit report"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>
          <div className="intake-field">
            <label htmlFor="dispute-address">Street Address</label>
            <input
              id="dispute-address"
              type="text"
              placeholder="123 Main St, Apt 4"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div className="field-row">
            <div className="intake-field">
              <label htmlFor="dispute-city">City</label>
              <input id="dispute-city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div className="intake-field">
              <label htmlFor="dispute-state">State</label>
              <input id="dispute-state" type="text" placeholder="TX" maxLength={2} value={form.state} onChange={(e) => update("state", e.target.value.toUpperCase())} />
            </div>
            <div className="intake-field">
              <label htmlFor="dispute-zip">ZIP</label>
              <input id="dispute-zip" type="text" placeholder="75001" maxLength={5} value={form.zip} onChange={(e) => update("zip", e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="intake-field">
              <label htmlFor="dispute-dob">Date of Birth</label>
              <input id="dispute-dob" type="text" placeholder="MM/DD/YYYY" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
            </div>
            <div className="intake-field">
              <label htmlFor="dispute-ssn4">Last 4 of SSN</label>
              <input id="dispute-ssn4" type="text" placeholder="XXXX" maxLength={4} value={form.ssn4} onChange={(e) => update("ssn4", e.target.value)} />
            </div>
          </div>

          {/* Bureau */}
          <div className="intake-field">
            <label>Which bureau are you disputing with?</label>
            <div className="radio-group">
              {(["equifax", "experian", "transunion"] as const).map((b) => (
                <label key={b} className={`radio-option ${form.bureau === b ? "selected" : ""}`}>
                  <input type="radio" name="bureau" value={b} checked={form.bureau === b} onChange={() => update("bureau", b)} />
                  <span className="radio-label">{b.charAt(0).toUpperCase() + b.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disputed Item */}
          <div className="intake-field">
            <label htmlFor="dispute-account">Creditor / Account Name</label>
            <input id="dispute-account" type="text" placeholder="e.g. Chase, Capital One, Midland Credit" value={form.accountName} onChange={(e) => update("accountName", e.target.value)} />
          </div>
          <div className="intake-field">
            <label htmlFor="dispute-acctnum">Account Number (partial)</label>
            <input id="dispute-acctnum" type="text" placeholder="Last 4-6 digits" value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
          </div>
          <div className="intake-field">
            <label htmlFor="dispute-errortype">Type of Error</label>
            <select id="dispute-errortype" value={form.errorType} onChange={(e) => update("errorType", e.target.value)}>
              {ERROR_TYPES.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <div className="intake-field">
            <label htmlFor="dispute-explanation">
              Additional Explanation
              <span className="field-optional">Optional — a default will be generated</span>
            </label>
            <textarea
              id="dispute-explanation"
              placeholder="Describe the specific error in your own words..."
              value={form.explanation}
              onChange={(e) => update("explanation", e.target.value.slice(0, 500))}
              maxLength={500}
              rows={4}
            />
          </div>

          <button type="button" className="btn-primary" onClick={generateLetter} style={{ width: "100%", justifyContent: "center" }}>
            Generate Dispute Letter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Generated Letter Preview */}
      {generated && (
        <div className="dispute-preview">
          <div className="dispute-preview-header">
            <h2>Your Dispute Letter</h2>
            <div className="dispute-preview-actions">
              <button className="btn-ghost" onClick={copyToClipboard}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </button>
              <button className="btn-ghost" onClick={downloadLetter}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
            </div>
          </div>
          <pre className="dispute-letter-text">{generated}</pre>
        </div>
      )}
    </div>
  );
}
