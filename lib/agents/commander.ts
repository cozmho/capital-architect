import { TaskPlanSchema, type TaskPlan, type Subtask } from "./schemas";
import { callGemini, extractJson, executeWithRetry } from "./gemini";
import { DEFAULT_MODEL } from "../ai/client";


function buildSystemPrompt(schemaDescription: string): string {
  return `You are a task planning assistant for the Capital Architect multi-agent system.

${schemaDescription}

Output ONLY valid JSON. No markdown, no explanations, no text outside the JSON object.
The JSON must parse cleanly and pass Zod validation against the schema above.`;
}

function buildUserPrompt(objective: string, context?: Record<string, unknown>): string {
  const contextSection = context && Object.keys(context).length > 0
    ? `\n\nAdditional context:\n${Object.entries(context).map(([k, v]) => `- ${k}: ${String(v)}`).join("\n")}`
    : "";

  return `Decompose the following objective into a prioritized list of subtasks for specialized agents.

Objective: "${objective}"${contextSection}

Rules:
- Each subtask must have a unique id (use "task_1", "task_2", etc.)
- Assign order numbers starting from 0, in execution sequence
- If a subtask depends on another, set dependsOn to that subtask's id
- agentName must be one of: Researcher, Copywriter, Compliance
- payload must match the input schema for the chosen agent (see schema details below)
- description should be a concise one-line summary of what this subtask does
- Include 1-5 subtasks. If the objective is simple, 1-2 may be enough.
- If no agents are relevant, include a single Researcher subtask.`;

}

/**
 * Decomposes a user objective into a typed subtask plan using Gemini.
 * The response is validated against TaskPlanSchema before returning.
 */
export async function command(
  objective: string,
  context?: Record<string, unknown>,
): Promise<TaskPlan> {
  const schemaDescription = `
The output must be a JSON object with this structure:
{
  "subtasks": [
    {
      "id": "string — unique identifier, use task_1, task_2, etc.",
      "agentName": "Researcher" | "Copywriter" | "Compliance",
      "recommendedModel": "string — model name for this subtask",
      "payload": { ... } — input payload matching the agent's input schema,
      "description": "string — one-line description of this subtask",
      "dependsOn": "string? — id of a subtask this depends on (optional)",
      "order": number — execution order, starting from 0
    }
  ]
}

Agent input schemas:
- Researcher: { query: string, context?: object, focusAreas?: string[] }
- Copywriter: { topic: string, tone: "professional" | "casual" | "technical" | "persuasive", audience?: string, length?: "short" | "medium" | "long", sourceMaterial?: object }
- Compliance: { content: string, checkType: "cfpb" | "fomc" | "disclaimer" | "general", jurisdiction?: string }

If a subtask depends on another, its order must be greater than the dependency's order.`;

  const systemPrompt = buildSystemPrompt(schemaDescription);
  const userPrompt = buildUserPrompt(objective, context);

  const raw = await executeWithRetry(async () => {
    const text = await callGemini(userPrompt, systemPrompt, DEFAULT_MODEL);
    return extractJson(text);
  });

  const parsed = TaskPlanSchema.parse(JSON.parse(raw));

  // Ensure IDs are unique
  const seen = new Set<string>();
  parsed.subtasks.forEach((t, i) => {
    if (seen.has(t.id)) {
      t.id = `${t.id}_${i}`;
    }
    seen.add(t.id);
  });

  return parsed;
}
