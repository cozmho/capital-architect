import { z } from "zod";
import { callGemini, extractJson, executeWithRetry } from "./gemini";
import {
  ResearcherInputSchema,
  CopywriterInputSchema,
  ComplianceInputSchema,
  ResearcherOutputSchema,
  CopywriterOutputSchema,
  ComplianceOutputSchema,
} from "./schemas";

type ResearcherInput = z.infer<typeof ResearcherInputSchema>;
type CopywriterInput = z.infer<typeof CopywriterInputSchema>;
type ComplianceInput = z.infer<typeof ComplianceInputSchema>;
type ResearcherOutput = z.infer<typeof ResearcherOutputSchema>;
type CopywriterOutput = z.infer<typeof CopywriterOutputSchema>;
type ComplianceOutput = z.infer<typeof ComplianceOutputSchema>;

const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3-flash-preview";

// ─── Shared helpers ────────────────────────────────────────────────────────

function systemPromptFor(schemaJson: string): string {
  return `You are a specialized agent for the Capital Architect multi-agent system.
Output ONLY valid JSON matching the structure below. No markdown, no explanations, no text outside the JSON object.

Schema:
${schemaJson}`;
}

function execute(
  userPrompt: string,
  schemaJson: string,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  return executeWithRetry(async () => {
    const text = await callGemini(userPrompt, systemPromptFor(schemaJson), model);
    return extractJson(text);
  });
}

// ─── Researcher ────────────────────────────────────────────────────────────

const RESEARCHER_OUTPUT_SCHEMA = JSON.stringify({
  findings: [
    {
      title: "string",
      summary: "string",
      source: "string?",
      confidence: '"high" | "medium" | "low"',
    },
  ],
  summary: "string",
  followUpQuestions: ["string?"],
});

function buildResearcherPrompt(input: ResearcherInput): string {
  const focus = input.focusAreas?.length
    ? `\n\nFocus areas:\n${input.focusAreas.map((f) => `- ${f}`).join("\n")}`
    : "";
  const ctx = input.context && Object.keys(input.context).length > 0
    ? `\n\nContext:\n${Object.entries(input.context).map(([k, v]) => `- ${k}: ${String(v)}`).join("\n")}`
    : "";
  return `Research the following query and return structured findings.

Query: "${input.query}"${focus}${ctx}

Return a JSON object with this structure:
{
  "findings": [
    {
      "title": "short title for this finding",
      "summary": "1-3 sentence summary",
      "source": "where this came from (optional)",
      "confidence": "high | medium | low"
    }
  ],
  "summary": "overall research summary, 1-2 sentences",
  "followUpQuestions": ["optional follow-up questions"]
}`;
}

export async function researcherWorker(
  input: ResearcherInput,
  model: string = DEFAULT_MODEL,
): Promise<ResearcherOutput> {
  const userPrompt = buildResearcherPrompt(input);
  const raw = await execute(userPrompt, RESEARCHER_OUTPUT_SCHEMA, model);
  return ResearcherOutputSchema.parse(JSON.parse(raw));
}

// ─── Copywriter ────────────────────────────────────────────────────────────

const COPYWRITER_OUTPUT_SCHEMA = JSON.stringify({
  content: "string",
  wordCount: "number",
  tone: "string",
  suggestions: ["string?"],
});

function buildCopywriterPrompt(input: CopywriterInput): string {
  const audience = input.audience ? `\n\nAudience: ${input.audience}` : "";
  const length = input.length ? `\n\nLength: ${input.length}` : "";
  const src = input.sourceMaterial && Object.keys(input.sourceMaterial).length > 0
    ? `\n\nSource material:\n${JSON.stringify(input.sourceMaterial, null, 2)}`
    : "";
  return `Write content based on the following brief.

Topic: "${input.topic}"
Tone: ${input.tone}${audience}${length}${src}

Return a JSON object with this structure:
{
  "content": "the generated content",
  "wordCount": <number of words in content>,
  "tone": "the tone used",
  "suggestions": ["optional improvement suggestions"]
}`;
}

export async function copywriterWorker(
  input: CopywriterInput,
  model: string = DEFAULT_MODEL,
): Promise<CopywriterOutput> {
  const userPrompt = buildCopywriterPrompt(input);
  const raw = await execute(userPrompt, COPYWRITER_OUTPUT_SCHEMA, model);
  const parsed = CopywriterOutputSchema.parse(JSON.parse(raw));
  parsed.wordCount = parsed.content.split(/\s+/).filter(Boolean).length;
  return parsed;
}

// ─── Compliance ────────────────────────────────────────────────────────────

const COMPLIANCE_OUTPUT_SCHEMA = JSON.stringify({
  status: '"pass" | "flag" | "fail"',
  issues: [
    {
      severity: '"low" | "medium" | "high"',
      category: "string",
      description: "string",
      suggestion: "string?",
    },
  ],
  summary: "string",
  approved: "boolean",
});

function buildCompliancePrompt(input: ComplianceInput): string {
  return `Review the following content for compliance and regulatory issues.

Content: "${input.content}"
Check type: ${input.checkType}
Jurisdiction: ${input.jurisdiction}

Return a JSON object with this structure:
{
  "status": "pass | flag | fail",
  "issues": [
    {
      "severity": "low | medium | high",
      "category": "area of concern",
      "description": "what the issue is",
      "suggestion": "how to fix it (optional)"
    }
  ],
  "summary": "overall compliance assessment, 1-2 sentences",
  "approved": <boolean>
}`;
}

export async function complianceWorker(
  input: ComplianceInput,
  model: string = DEFAULT_MODEL,
): Promise<ComplianceOutput> {
  const userPrompt = buildCompliancePrompt(input);
  const raw = await execute(userPrompt, COMPLIANCE_OUTPUT_SCHEMA, model);
  return ComplianceOutputSchema.parse(JSON.parse(raw));
}
