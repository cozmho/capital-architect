"use server";

// ============================================================================
// VERDIC™ SCORING ENGINE — SERVER-ONLY
// ============================================================================
// This file runs EXCLUSIVELY on the server. The scoring weights, tier
// thresholds, and underwriting logic NEVER ship to the browser.
//
// The client sends form data → the server does the math → the server
// returns the tier. That's it.
//
// TODO: Wire to Supabase to persist prospect data and scores
// ============================================================================

// ---------------------------------------------------------------------------
// BUSINESS PATH — Full intake
// ---------------------------------------------------------------------------
export interface BusinessFormData {
  path: "business";

  // Step 1 — You + Your Business
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  industry: string;
  revenueRange: string;
  monthlyRevenue: string;
  businessGoal: string;
  referralSource: string;

  // Step 2 — Credit Profile
  creditScoreRange: string;
  hasMetro2Errors: string;
  hardInquiries: string;
  hasCollections: string;
  hasBankruptcy: string;
  isAuthorizedUser: string;
  oldestAccountAge: string;
  creditUtilization: string;

  // Step 3 — Entity & Structure
  businessAge: string;
  hasBusinessBank: string;
  hasEIN: string;
  existingBusinessCredit: string;
  deniedFunding: string;
  hasDUNS: string;
  addressType: string;
  hasOpenBusinessLoans: string;
  hasFiledBusinessTaxes: string;

  // Step 4 — Goals & Timeline
  capitalTarget: string;
  fundingTimeline: string;
  biggestObstacle: string;
  workedWithCompanyBefore: string;
}

// ---------------------------------------------------------------------------
// PRE-BUSINESS PATH — Lighter intake
// ---------------------------------------------------------------------------
export interface PreBusinessFormData {
  path: "pre-business";

  // Step 1 — You
  fullName: string;
  email: string;
  phone: string;
  buildingToward: string;
  referralSource: string;

  // Step 2 — Personal Credit Profile
  creditScoreRange: string;
  hasMetro2Errors: string;
  hardInquiries: string;
  hasCollections: string;
  hasBankruptcy: string;
  oldestAccountAge: string;
  creditUtilization: string;
  isAuthorizedUser: string;

  // Step 3 — Readiness
  hasEIN: string;
  hasBusinessBank: string;
  hasBusinessName: string;
  capitalTarget: string;
  biggestObstacle: string;
}

export type IntakeFormData = BusinessFormData | PreBusinessFormData;

export interface VerdicResult {
  score: number;
  tier: "A" | "B" | "C";
  route: "ready" | "prep" | "repair" | "prelaunch";
  hasMetro2Errors: boolean;
  path: "business" | "pre-business";
  complianceItems?: { id: string; label: string; status: "pass" | "fail" | "pending"; description: string }[];
}

// ============================================================================
// SCORING ENGINE
// ============================================================================
export async function calculateVerdicScore(
  formData: IntakeFormData
): Promise<VerdicResult> {
  // -----------------------------------------------------------------
  // Log prospect data
  // TODO: wire to Supabase — INSERT into prospects table
  // -----------------------------------------------------------------
  console.log("=== NEW INTAKE SUBMISSION ===");
  console.log("Path:", formData.path);
  console.log("Name:", formData.fullName);
  console.log("Email:", formData.email);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Full data:", JSON.stringify(formData, null, 2));

  if (formData.path === "business") {
    return scoreBusinessPath(formData);
  } else {
    return scorePreBusinessPath(formData);
  }
}

// ============================================================================
// BUSINESS PATH SCORING — Base 100
// ============================================================================
function scoreBusinessPath(data: BusinessFormData): VerdicResult {
  let score = 100;

  // --- Credit Score Impact (heaviest weight) ---
  switch (data.creditScoreRange) {
    case "750+":      break;
    case "700-749":   score -= 5;  break;
    case "650-699":   score -= 15; break;
    case "600-649":   score -= 25; break;
    case "below-600": score -= 40; break;
    case "not-sure":  score -= 20; break;
  }

  // --- Metro 2 Errors ---
  const hasMetro2Errors = data.hasMetro2Errors === "yes";
  if (hasMetro2Errors) score -= 12;
  else if (data.hasMetro2Errors === "not-sure") score -= 6;

  // --- Hard Inquiries ---
  switch (data.hardInquiries) {
    case "0":    break;
    case "1-2":  score -= 4;  break;
    case "3-5":  score -= 10; break;
    case "6-10": score -= 18; break;
    case "10+":  score -= 25; break;
  }

  // --- Collections / Charge-offs ---
  if (data.hasCollections === "yes") score -= 15;

  // --- Bankruptcy ---
  if (data.hasBankruptcy === "yes") score -= 20;

  // --- Authorized User Bonus ---
  if (data.isAuthorizedUser === "yes") score += 3;

  // --- Oldest Account Age ---
  switch (data.oldestAccountAge) {
    case "10+":    score += 3; break;
    case "7-10":   score += 2; break;
    case "3-7":    break;
    case "1-3":    score -= 5; break;
    case "less-1": score -= 5; break;
  }

  // --- Credit Utilization ---
  switch (data.creditUtilization) {
    case "under-10": score += 2; break;
    case "10-30":    break;
    case "30-50":    score -= 4; break;
    case "50-75":    score -= 8; break;
    case "over-75":  score -= 8; break;
    case "not-sure": score -= 3; break;
  }

  // --- Business Entity Type ---
  switch (data.businessType) {
    case "llc":                  score += 3; break;
    case "s-corp":               score += 5; break;
    case "c-corp":               score += 5; break;
    case "partnership":          score += 1; break;
    case "sole-proprietorship":  score -= 3; break;
    case "not-formed":           score -= 8; break;
  }

  // --- Business Age ---
  switch (data.businessAge) {
    case "5+":          score += 5;  break;
    case "3-5":         score += 3;  break;
    case "1-2":         break;
    case "less-than-1": score -= 5;  break;
    case "not-started": score -= 10; break;
  }

  // --- Revenue Range ---
  switch (data.revenueRange) {
    case "1m+":        score += 5;  break;
    case "500k-1m":    score += 3;  break;
    case "150k-500k":  score += 1;  break;
    case "50k-150k":   break;
    case "under-50k":  score -= 3;  break;
    case "pre-revenue": score -= 8; break;
  }

  // --- Monthly Revenue ---
  switch (data.monthlyRevenue) {
    case "50k+":          score += 3; break;
    case "15k-50k":       score += 1; break;
    case "5k-15k":        break;
    case "under-5k":      score -= 3; break;
    case "inconsistent":  score -= 5; break;
  }

  // --- Business Infrastructure ---
  if (data.hasBusinessBank === "yes") score += 3;
  else score -= 5;

  if (data.hasEIN === "yes") score += 2;
  else score -= 4;

  // --- D&B / Tradeline ---
  if (data.hasDUNS === "yes") score += 4;
  else if (data.hasDUNS === "not-sure") score -= 2;
  else score -= 4;

  // --- Address Type ---
  switch (data.addressType) {
    case "commercial":    score += 4; break;
    case "virtual-office": score += 1; break;
    case "home":          score -= 5; break;
    case "po-box":        score -= 3; break;
  }

  // --- Business Taxes ---
  if (data.hasFiledBusinessTaxes === "yes") score += 6;
  else if (data.hasFiledBusinessTaxes === "no") score -= 5;
  // "not-applicable" = no change

  // --- Open Business Loans ---
  if (data.hasOpenBusinessLoans === "yes") score += 2;

  // --- Existing Business Credit ---
  switch (data.existingBusinessCredit) {
    case "multiple": score += 5; break;
    case "1-2":      score += 2; break;
    case "none":     score -= 3; break;
  }

  // --- Recent Denial ---
  if (data.deniedFunding === "yes") score -= 5;

  // --- Clamp & Tier ---
  score = Math.max(0, Math.min(100, score));

  let tier: "A" | "B" | "C";
  let route: "ready" | "prep" | "repair";

  if (score >= 80) {
    tier = "A"; route = "ready";
  } else if (score >= 65) {
    tier = "B"; route = "prep";
  } else {
    tier = "C"; route = "repair";
  }

  // MCP-20 Compliance Checks
  const complianceItems: { id: string; label: string; status: "pass" | "fail" | "pending"; description: string }[] = [
    { id: "ein", label: "Tax ID (EIN)", status: data.hasEIN === "yes" ? "pass" : "fail", description: "Business EIN registration" },
    { id: "bank", label: "Business Bank", status: data.hasBusinessBank === "yes" ? "pass" : "fail", description: "Dedicated commercial banking" },
    { id: "address", label: "Business Address", status: data.addressType === "commercial" || data.addressType === "virtual-office" ? "pass" : "fail", description: "Professional address requirement" },
    { id: "duns", label: "D-U-N-S Number", status: data.hasDUNS === "yes" ? "pass" : "fail", description: "Registration with D&B" },
    { id: "taxes", label: "Business Taxes", status: data.hasFiledBusinessTaxes === "yes" ? "pass" : "fail", description: "Tax compliance standing" },
  ];

  console.log(`=== VERDIC RESULT [BUSINESS]: Score=${score}, Tier=${tier} ===`);

  return { score, tier, route, hasMetro2Errors, path: "business", complianceItems };
}

// ============================================================================
// PRE-BUSINESS PATH SCORING — Base 85
// ============================================================================
function scorePreBusinessPath(data: PreBusinessFormData): VerdicResult {
  let score = 85; // Structurally lower ceiling — no operating entity yet

  // --- Credit Score Impact ---
  switch (data.creditScoreRange) {
    case "750+":      break;
    case "700-749":   score -= 5;  break;
    case "650-699":   score -= 15; break;
    case "600-649":   score -= 25; break;
    case "below-600": score -= 40; break;
    case "not-sure":  score -= 20; break;
  }

  // --- Metro 2 Errors ---
  const hasMetro2Errors = data.hasMetro2Errors === "yes";
  if (hasMetro2Errors) score -= 12;
  else if (data.hasMetro2Errors === "not-sure") score -= 6;

  // --- Hard Inquiries ---
  switch (data.hardInquiries) {
    case "0":    break;
    case "1-2":  score -= 4;  break;
    case "3-5":  score -= 10; break;
    case "6-10": score -= 18; break;
    case "10+":  score -= 25; break;
  }

  // --- Collections ---
  if (data.hasCollections === "yes") score -= 15;

  // --- Bankruptcy ---
  if (data.hasBankruptcy === "yes") score -= 20;

  // --- Authorized User Bonus ---
  if (data.isAuthorizedUser === "yes") score += 3;

  // --- Oldest Account Age ---
  switch (data.oldestAccountAge) {
    case "10+":    score += 3; break;
    case "7-10":   score += 2; break;
    case "3-7":    break;
    case "1-3":    score -= 5; break;
    case "less-1": score -= 5; break;
  }

  // --- Credit Utilization ---
  switch (data.creditUtilization) {
    case "under-10": score += 2; break;
    case "10-30":    break;
    case "30-50":    score -= 4; break;
    case "50-75":    score -= 8; break;
    case "over-75":  score -= 8; break;
    case "not-sure": score -= 3; break;
  }

  // --- Infrastructure Readiness ---
  if (data.hasEIN === "yes") score += 4;
  else if (data.hasEIN === "whats-that") score -= 8;
  else score -= 8;

  if (data.hasBusinessBank === "yes") score += 3;
  else score -= 6;

  if (data.hasBusinessName === "no") score -= 2;

  // --- Clamp ---
  score = Math.max(0, Math.min(100, score));

  // Pre-business uses different thresholds & routes to /prelaunch for Tier C
  let tier: "A" | "B" | "C";
  let route: "ready" | "prep" | "repair" | "prelaunch";

  if (score >= 80) {
    tier = "A"; route = "ready";
  } else if (score >= 55) {
    tier = "B"; route = "prep";
  } else {
    tier = "C"; route = "prelaunch"; // Different page for pre-business
  }

  console.log(`=== VERDIC RESULT [PRE-BUSINESS]: Score=${score}, Tier=${tier} ===`);

  return { score, tier, route, hasMetro2Errors, path: "pre-business", complianceItems: [] };
}
