import { GoogleGenAI } from "@google/genai";

export type LeadStrategyLead = {
  id: string;
  businessName: string;
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  ficoScore?: number | null;
  monthlyRevenue?: number | null;
  timeInBusiness?: number | null;
  tier?: string | null;
  status?: string | null;
  notes?: string | null;
  metro2ErrorCount?: number | null;
  hasIdentityTheftBlock?: boolean | null;
  complianceStatus?: string | null;
  chase524Count?: number | null;
  recentInquiries?: number | null;
  entityType?: string | null;
  fundabilityScore?: number | null;
};

export type LeadStrategySignals = {
  positiveSignals: string[];
  riskSignals: string[];
  primaryScoreReason: string;
  topRiskSignal: string;
  highestImpactAction: string;
  nextTierTarget: string;
  isSparse: boolean;
};

export type LeadStrategyResult = {
  strategy: string;
  source: "ai" | "deterministic";
};

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3-flash-preview";
const REQUEST_TIMEOUT_MS = 3500;

const SYSTEM_PROMPT = `You are Deal Strategy Analyst for Capital Architect, a B2B funding consultancy.
Your job is to produce one concise, practical strategy sentence for a single lead.
Base your guidance only on provided lead fields and deterministic score factors.
Do not invent facts. Do not mention unknown data.
Do not provide legal, tax, or guaranteed-outcome claims.
Do not use hype, fear, or shaming language.
Tone must be professional, direct, and action-oriented.
Output must be one sentence, plain text, max 28 words.
If confidence is low due to missing critical fields, still produce one sentence focused on the highest-confidence next step.
Never output markdown, bullets, JSON, or labels.`;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeLabelPrefix(value: string): string {
  return value
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(deal strategy|strategy|recommendation)\s*:\s*/i, "")
    .replace(/\s+/g, " ");
}

function stripTrailingSentencePunctuation(value: string): string {
  return value.replace(/[.!?]+$/u, "").trim();
}

export function normalizeStrategySentence(value: string): string | null {
  const normalized = normalizeLabelPrefix(value).replace(/\r?\n+/g, " ").trim();

  if (!normalized) return null;
  if (/\r|\n/.test(value)) return null;
  if (/^[-*•]/.test(normalized)) return null;
  if (/[{}\[\]]/.test(normalized)) return null;

  const sentenceCount = normalized
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
  if (sentenceCount !== 1) return null;

  const sentence = stripTrailingSentencePunctuation(normalized);
  if (wordCount(sentence) > 28) return null;

  return sentence;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonths(value: number): string {
  return `${value} month${value === 1 ? "" : "s"}`;
}

function formatPromptValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}

function getTierTarget(score: number | null | undefined): string {
  if (score === null || score === undefined) return "Tier A";
  if (score >= 80) return "Tier A deployment";
  if (score >= 65) return "Tier A eligibility";
  return "Tier B eligibility";
}

function isComplianceClear(value: string | null | undefined): boolean {
  if (!value) return false;
  return /clear|compliant|verified/i.test(value);
}

export function buildLeadStrategySignals(lead: LeadStrategyLead): LeadStrategySignals {
  const positiveSignals: string[] = [];
  const riskSignals: string[] = [];

  const fundabilityScore = lead.fundabilityScore ?? null;
  const recentInquiries = lead.recentInquiries ?? null;
  const metro2ErrorCount = lead.metro2ErrorCount ?? null;
  const timeInBusiness = lead.timeInBusiness ?? null;
  const monthlyRevenue = lead.monthlyRevenue ?? null;
  const complianceStatus = lead.complianceStatus ?? null;
  const entityType = lead.entityType ?? null;

  if (fundabilityScore !== null) {
    if (fundabilityScore >= 80) {
      positiveSignals.push("Tier A fundability");
    } else if (fundabilityScore >= 65) {
      positiveSignals.push("Tier B with upside to Tier A");
    } else {
      riskSignals.push("Fundability score remains below Tier B");
    }
  }

  if (entityType === "LLC") {
    positiveSignals.push("LLC structure supports funding readiness");
  } else if (entityType === "Private Trust") {
    positiveSignals.push("Private Trust structure supports funding readiness");
  } else if (entityType) {
    riskSignals.push(`Entity type is ${entityType}`);
  }

  if (metro2ErrorCount !== null) {
    if (metro2ErrorCount > 0) {
      riskSignals.push(`${metro2ErrorCount} Metro 2 error${metro2ErrorCount === 1 ? "" : "s"}`);
    } else {
      positiveSignals.push("No Metro 2 errors reported");
    }
  }

  if (recentInquiries !== null) {
    if (recentInquiries > 4) {
      riskSignals.push("Recent inquiries are elevated");
    } else if (recentInquiries >= 2) {
      riskSignals.push("Recent inquiries need a light-touch approach");
    } else {
      positiveSignals.push("Inquiry count is currently manageable");
    }
  }

  if (complianceStatus) {
    if (isComplianceClear(complianceStatus)) {
      positiveSignals.push(`Compliance status is ${complianceStatus}`);
    } else {
      riskSignals.push(`Compliance status is ${complianceStatus}`);
    }
  }

  if (timeInBusiness !== null) {
    if (timeInBusiness >= 24) {
      positiveSignals.push(`Business history is ${formatMonths(timeInBusiness)}`);
    } else if (timeInBusiness < 12) {
      riskSignals.push(`Business history is only ${formatMonths(timeInBusiness)}`);
    }
  }

  if (monthlyRevenue !== null) {
    if (monthlyRevenue >= 50000) {
      positiveSignals.push(`Monthly revenue is ${formatCurrency(monthlyRevenue)}`);
    } else if (monthlyRevenue < 10000) {
      riskSignals.push(`Monthly revenue is ${formatCurrency(monthlyRevenue)}`);
    }
  }

  if (lead.hasIdentityTheftBlock) {
    riskSignals.push("Identity theft block is present");
  }

  if ((lead.chase524Count ?? 0) > 0) {
    riskSignals.push(`Chase 5/24 count is ${lead.chase524Count}`);
  }

  const sparseFieldCount = [
    lead.fundabilityScore,
    lead.entityType,
    lead.metro2ErrorCount,
    lead.recentInquiries,
    lead.complianceStatus,
    lead.timeInBusiness,
    lead.monthlyRevenue,
  ].filter((value) => value === null || value === undefined).length;

  const isSparse = sparseFieldCount >= 4;

  let primaryScoreReason = "Confirm the missing fields before advancing";

  if (metro2ErrorCount !== null && metro2ErrorCount > 0) {
    primaryScoreReason = "Prioritize Metro 2 cleanup first";
  } else if (recentInquiries !== null && recentInquiries > 4) {
    primaryScoreReason = "Pause new credit pulls and let inquiries season";
  } else if (complianceStatus && !isComplianceClear(complianceStatus)) {
    primaryScoreReason = "Resolve compliance status before outreach";
  } else if (lead.hasIdentityTheftBlock) {
    primaryScoreReason = "Clear the identity theft block before deployment";
  } else if (timeInBusiness !== null && timeInBusiness < 12) {
    primaryScoreReason = "Strengthen the operating history before pushing funding";
  } else if (monthlyRevenue !== null && monthlyRevenue < 10000) {
    primaryScoreReason = "Document revenue support before advancing the file";
  } else if (entityType === "LLC") {
    primaryScoreReason = "Use the LLC structure to support a Tier A push";
  } else if (entityType === "Private Trust") {
    primaryScoreReason = "Use the Private Trust structure to support a Tier A push";
  } else if (fundabilityScore !== null) {
    primaryScoreReason = `Move this lead toward ${getTierTarget(fundabilityScore)}`;
  }

  const topRiskSignal = riskSignals[0] ?? "No major risk signals surfaced";
  const highestImpactAction =
    metro2ErrorCount !== null && metro2ErrorCount > 0
      ? "clean up the Metro 2 file"
      : recentInquiries !== null && recentInquiries > 4
        ? "let the recent inquiries season"
        : !isComplianceClear(complianceStatus)
          ? "resolve compliance status"
          : lead.hasIdentityTheftBlock
            ? "remove the identity theft block"
            : timeInBusiness !== null && timeInBusiness < 12
              ? "build more operating history"
              : monthlyRevenue !== null && monthlyRevenue < 10000
                ? "document stronger revenue support"
                : entityType === "LLC"
                  ? "use the LLC structure in the funding conversation"
                  : entityType === "Private Trust"
                    ? "use the Private Trust structure in the funding conversation"
                    : "prepare the lead for the next funding step";

  const nextTierTarget = getTierTarget(fundabilityScore);

  return {
    positiveSignals,
    riskSignals,
    primaryScoreReason,
    topRiskSignal,
    highestImpactAction,
    nextTierTarget,
    isSparse,
  };
}

function buildUserPrompt(lead: LeadStrategyLead, signals: LeadStrategySignals): string {
  const leadContext = [
    `- Fundability score: ${formatPromptValue(lead.fundabilityScore)}`,
    `- Tier: ${formatPromptValue(lead.tier)}`,
    `- Entity type: ${formatPromptValue(lead.entityType)}`,
    `- Metro2 errors: ${formatPromptValue(lead.metro2ErrorCount)}`,
    `- Recent inquiries: ${formatPromptValue(lead.recentInquiries)}`,
    `- Compliance status: ${formatPromptValue(lead.complianceStatus)}`,
    `- Time in business: ${formatPromptValue(lead.timeInBusiness !== null && lead.timeInBusiness !== undefined ? formatMonths(lead.timeInBusiness) : null)}`,
    `- Monthly revenue: ${formatPromptValue(lead.monthlyRevenue !== null && lead.monthlyRevenue !== undefined ? formatCurrency(lead.monthlyRevenue) : null)}`,
    `- Notes (optional): ${formatPromptValue(lead.notes)}`,
  ].join("\n");

  return `${leadContext}

Deterministic scoring signals:
- Positive signals: ${signals.positiveSignals.length ? signals.positiveSignals.join(", ") : "None surfaced"}
- Risk signals: ${signals.riskSignals.length ? signals.riskSignals.join(", ") : "None surfaced"}
- Primary score reason: ${signals.primaryScoreReason}

Task:
Write one sentence called Deal Strategy that tells the operator the best immediate action to improve or deploy this lead.
Constraints:
- Max 28 words
- No guarantees
- No legal/tax advice
- Use plain business language
- Must align with provided deterministic signals`;
}

async function generateWithTimeout(apiKey: string, lead: LeadStrategyLead, signals: LeadStrategySignals): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const responsePromise = ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: buildUserPrompt(lead, signals),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 48,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error("Gemini request timed out"));
    }, REQUEST_TIMEOUT_MS);
  });

  const response = await Promise.race([responsePromise, timeoutPromise]);
  return (response as { text?: string | null }).text ?? "";
}

export function buildDeterministicFallbackSentence(signals: LeadStrategySignals): string {
  if (signals.isSparse) {
    return `${signals.primaryScoreReason}, then re-score for ${signals.nextTierTarget}.`;
  }

  return `${signals.primaryScoreReason}, then re-score for ${signals.nextTierTarget}.`;
}

export async function generateLeadStrategy(lead: LeadStrategyLead, apiKey: string | undefined): Promise<LeadStrategyResult> {
  const signals = buildLeadStrategySignals(lead);
  const fallbackStrategy = buildDeterministicFallbackSentence(signals);

  if (!apiKey || /x{8,}/i.test(apiKey)) {
    return { strategy: fallbackStrategy, source: "deterministic" };
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const text = await generateWithTimeout(apiKey, lead, signals);
      const validated = normalizeStrategySentence(text);

      if (validated) {
        return { strategy: validated, source: "ai" };
      }
    } catch {
      // Try one fast retry, then fall back deterministically.
    }
  }

  return { strategy: fallbackStrategy, source: "deterministic" };
}
