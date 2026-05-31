"use client";

import { useState } from "react";

interface Metro2Data {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn4: string;
  dob: string;
  furnisherName: string;
  furnisherAddress: string;
  accountNumber: string;
  errorCategory: string;
  reportedValue: string;
  correctValue: string;
  explanation: string;
}

const INITIAL: Metro2Data = {
  fullName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  ssn4: "",
  dob: "",
  furnisherName: "",
  furnisherAddress: "",
  accountNumber: "",
  errorCategory: "payment-rating",
  reportedValue: "",
  correctValue: "",
  explanation: "",
};

const ERROR_CATEGORIES = [
  { value: "payment-rating", label: "Payment Rating Code (Field 17A)" },
  { value: "account-status", label: "Account Status Code (Field 17)" },
  { value: "current-balance", label: "Current Balance (Field 21)" },
  { value: "amount-past-due", label: "Amount Past Due (Field 22)" },
  { value: "date-of-account", label: "Date of Account Information (Field 24)" },
  { value: "date-opened", label: "Date Opened (Field 13)" },
  { value: "credit-limit", label: "Credit Limit (Field 20)" },
  { value: "highest-credit", label: "Highest Credit Amount (Field 19)" },
  { value: "payment-history", label: "Payment History Profile (Field 25)" },
  { value: "special-comment", label: "Special Comment Code (Field 19A)" },
  { value: "compliance-code", label: "Compliance Condition Code (Field 18)" },
  { value: "consumer-info", label: "Consumer Information Indicator (Field 26)" },
  { value: "ecoa", label: "ECOA Code (Field 5)" },
  { value: "account-type", label: "Account Type (Field 12)" },
  { value: "other", label: "Other Metro 2 Field Error" },
];

export default function Metro2CompliancePage() {
  const [form, setForm] = useState(INITIAL);
  const [generated, setGenerated] = useState<string | null>(null);

  const update = (field: keyof Metro2Data, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateLetter = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const errorLabel =
      ERROR_CATEGORIES.find((e) => e.value === form.errorCategory)?.label ||
      form.errorCategory;

    const letter = `${form.fullName}
${form.address}
${form.city}, ${form.state} ${form.zip}

${today}

${form.furnisherName}
${form.furnisherAddress}

Re: Direct Dispute of Inaccurate Metro 2 Reporting — FCRA § 623(a)(8) and CDIA Metro 2 Format Compliance

Dear Compliance Department,

I am writing to formally dispute the accuracy of information you are furnishing to one or more consumer reporting agencies regarding my account. Under the Fair Credit Reporting Act, Section 623(a)(8) (15 U.S.C. § 1681s-2(a)(8)), you are required to investigate this dispute and correct any information determined to be inaccurate, incomplete, or unverifiable.

CONSUMER IDENTIFICATION
Name: ${form.fullName}
Date of Birth: ${form.dob}
Last 4 of SSN: ${form.ssn4}

ACCOUNT INFORMATION
Account Number (partial): ${form.accountNumber}
Data Furnisher: ${form.furnisherName}

METRO 2 REPORTING ERROR
Field in Error: ${errorLabel}
Value Currently Reported: ${form.reportedValue || "[Not provided]"}
Correct Value: ${form.correctValue || "[See explanation below]"}

DETAILED EXPLANATION
${form.explanation || `The above field is being reported inaccurately to consumer reporting agencies. Under the Consumer Data Industry Association (CDIA) Metro 2 Credit Reporting Resource Guide, data furnishers are required to report consumer credit data in strict compliance with the Metro 2 format specifications. The current reporting on my account does not comply with these standards and must be corrected.`}

LEGAL BASIS AND OBLIGATIONS

As a data furnisher, you are subject to the following requirements under the FCRA:

1. ACCURACY OBLIGATION (§ 623(a)(1)): You shall not furnish information to a consumer reporting agency if you know or have reasonable cause to believe the information is inaccurate.

2. DUTY TO CORRECT (§ 623(a)(2)): Upon determining that furnished information is not complete or accurate, you must promptly notify the consumer reporting agency and provide corrections.

3. DIRECT DISPUTE INVESTIGATION (§ 623(a)(8)): Upon receiving a direct dispute from a consumer, you must conduct an investigation, review all relevant information, and report the results within 30 days.

4. METRO 2 COMPLIANCE: The CDIA Metro 2 format requires that all reported data fields conform to the published field specifications, valid value sets, and reporting rules. Errors in any field constitute a violation of data furnisher obligations.

REQUESTED ACTIONS

I request that you:
1. Conduct an investigation of this dispute within 30 days
2. Review the original account documentation against what is being reported
3. Correct the identified Metro 2 field error with all consumer reporting agencies
4. Provide me with written notice of the investigation results
5. Confirm the corrected data has been transmitted to all agencies to which you furnish

Please be advised that failure to investigate and correct inaccurate reporting may constitute a violation of the FCRA, subject to liability for actual damages, statutory damages of $100–$1,000 per violation, punitive damages, and reasonable attorney's fees under 15 U.S.C. § 1681n.

Sincerely,

${form.fullName}

Enclosures:
- Copy of government-issued identification
- Proof of address (utility bill or bank statement)
- Credit report excerpt showing the disputed information
- Supporting documentation of correct values`;

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
    a.download = `metro2-dispute-${form.furnisherName.replace(/\s+/g, "-").toLowerCase() || "furnisher"}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dispute-container">
      <div className="dispute-header">
        <div className="section-eyebrow">METRO 2 COMPLIANCE</div>
        <h1>Metro 2 Data Furnisher Dispute</h1>
        <p className="step-sub">
          Use this template to dispute inaccurate Metro 2 reporting directly
          with the data furnisher under FCRA § 623(a)(8). Unlike a bureau
          dispute, this goes straight to the company reporting the error.
        </p>
      </div>

      <div className="intake-card">
        <div className="intake-fields">
          {/* Personal Info */}
          <div className="intake-field">
            <label htmlFor="m2-name">Full Legal Name</label>
            <input
              id="m2-name"
              type="text"
              placeholder="As it appears on your credit report"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>
          <div className="intake-field">
            <label htmlFor="m2-address">Street Address</label>
            <input
              id="m2-address"
              type="text"
              placeholder="123 Main St, Apt 4"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div className="field-row">
            <div className="intake-field">
              <label htmlFor="m2-city">City</label>
              <input id="m2-city" type="text" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div className="intake-field">
              <label htmlFor="m2-state">State</label>
              <input id="m2-state" type="text" placeholder="TX" maxLength={2} value={form.state} onChange={(e) => update("state", e.target.value.toUpperCase())} />
            </div>
            <div className="intake-field">
              <label htmlFor="m2-zip">ZIP</label>
              <input id="m2-zip" type="text" placeholder="75001" maxLength={5} value={form.zip} onChange={(e) => update("zip", e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="intake-field">
              <label htmlFor="m2-dob">Date of Birth</label>
              <input id="m2-dob" type="text" placeholder="MM/DD/YYYY" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
            </div>
            <div className="intake-field">
              <label htmlFor="m2-ssn4">Last 4 of SSN</label>
              <input id="m2-ssn4" type="text" placeholder="XXXX" maxLength={4} value={form.ssn4} onChange={(e) => update("ssn4", e.target.value)} />
            </div>
          </div>

          {/* Furnisher Info */}
          <div className="intake-field">
            <label htmlFor="m2-furnisher">Data Furnisher Name</label>
            <input
              id="m2-furnisher"
              type="text"
              placeholder="e.g. Chase Bank, Capital One, Synchrony Financial"
              value={form.furnisherName}
              onChange={(e) => update("furnisherName", e.target.value)}
            />
          </div>
          <div className="intake-field">
            <label htmlFor="m2-furnisher-addr">Furnisher Mailing Address</label>
            <input
              id="m2-furnisher-addr"
              type="text"
              placeholder="Compliance Dept, P.O. Box 12345, City, ST ZIP"
              value={form.furnisherAddress}
              onChange={(e) => update("furnisherAddress", e.target.value)}
            />
          </div>
          <div className="intake-field">
            <label htmlFor="m2-acctnum">Account Number (partial)</label>
            <input
              id="m2-acctnum"
              type="text"
              placeholder="Last 4-6 digits"
              value={form.accountNumber}
              onChange={(e) => update("accountNumber", e.target.value)}
            />
          </div>

          {/* Error Details */}
          <div className="intake-field">
            <label htmlFor="m2-category">Metro 2 Field in Error</label>
            <select id="m2-category" value={form.errorCategory} onChange={(e) => update("errorCategory", e.target.value)}>
              {ERROR_CATEGORIES.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="intake-field">
              <label htmlFor="m2-reported">Value Currently Reported</label>
              <input
                id="m2-reported"
                type="text"
                placeholder="What appears on your report"
                value={form.reportedValue}
                onChange={(e) => update("reportedValue", e.target.value)}
              />
            </div>
            <div className="intake-field">
              <label htmlFor="m2-correct">Correct Value</label>
              <input
                id="m2-correct"
                type="text"
                placeholder="What it should say"
                value={form.correctValue}
                onChange={(e) => update("correctValue", e.target.value)}
              />
            </div>
          </div>
          <div className="intake-field">
            <label htmlFor="m2-explanation">
              Additional Explanation
              <span className="field-optional">Optional — a default will be generated</span>
            </label>
            <textarea
              id="m2-explanation"
              placeholder="Describe the specific Metro 2 error in your own words..."
              value={form.explanation}
              onChange={(e) => update("explanation", e.target.value.slice(0, 500))}
              maxLength={500}
              rows={4}
            />
          </div>

          <button type="button" className="btn-primary" onClick={generateLetter} style={{ width: "100%", justifyContent: "center" }}>
            Generate Metro 2 Dispute Letter
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
            <h2>Your Metro 2 Dispute Letter</h2>
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
