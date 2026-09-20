import { z } from "zod";

// ─── Commander output: decomposes a goal into typed subtasks ───

export const SubtaskSchema = z.object({
  agentName: z.enum(["Researcher", "Copywriter", "Compliance"]),
  recommendedModel: z.string().default("anthropic/claude-3.5-sonnet"),
  payload: z.record(z.any()),
  description: z.string(),
  dependsOn: z.string().optional(),
});

export const TaskPlanSchema = z.object({
  subtasks: z.array(SubtaskSchema).min(1),
  totalEstimatedCost: z.number().optional(),
});

export type TaskPlan = z.infer<typeof TaskPlanSchema>;
export type Subtask = z.infer<typeof SubtaskSchema>;

// ─── Worker input schemas (typed payloads) ───

export const ResearcherInputSchema = z.object({
  query: z.string(),
  context: z.record(z.any()).optional(),
  focusAreas: z.array(z.string()).optional(),
});

export const CopywriterInputSchema = z.object({
  topic: z.string(),
  tone: z.enum(["professional", "casual", "technical", "persuasive"]).default("professional"),
  audience: z.string().optional(),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  sourceMaterial: z.record(z.any()).optional(),
});

export const ComplianceInputSchema = z.object({
  content: z.string(),
  checkType: z.enum(["cfpb", "fomc", "disclaimer", "general"]).default("general"),
  jurisdiction: z.string().default("US"),
});

// ─── Worker output schemas ───

export const ResearcherOutputSchema = z.object({
  findings: z.array(
    z.object({
      title: z.string(),
      summary: z.string(),
      source: z.string().optional(),
      confidence: z.enum(["high", "medium", "low"]).default("medium"),
    })
  ),
  summary: z.string(),
  followUpQuestions: z.array(z.string()).optional(),
});

export const CopywriterOutputSchema = z.object({
  content: z.string(),
  wordCount: z.number(),
  tone: z.string(),
  suggestions: z.array(z.string()).optional(),
});

export const ComplianceOutputSchema = z.object({
  status: z.enum(["pass", "flag", "fail"]),
  issues: z.array(
    z.object({
      severity: z.enum(["low", "medium", "high"]),
      category: z.string(),
      description: z.string(),
      suggestion: z.string().optional(),
    })
  ),
  summary: z.string(),
  approved: z.boolean(),
});

// ─── Run/status types ───

export type RunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
export type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "APPROVAL_REQUIRED";
