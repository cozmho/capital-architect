import { TaskPlanSchema, type TaskPlan, type Subtask } from "./schemas";

/**
 * Commander: decomposes a user goal into a typed subtask plan.
 *
 * In production this would call an LLM (OpenRouter) to generate the plan.
 * For now it uses rule-based decomposition as a deterministic baseline.
 * Replace the body with an LLM call when ready — the Zod schema
 * validates whatever comes back.
 */
export async function command(
  objective: string,
  context?: Record<string, unknown>
): Promise<TaskPlan> {
  // TODO: replace with OpenRouter LLM call when API key is configured.
  // Example:
  //   const response = await openRouter.chat.complete({
  //     model: "anthropic/claude-3.5-sonnet",
  //     messages: [{ role: "user", content: `Decompose: ${objective}` }],
  //     response_format: { type: "json_object" },
  //   });
  //   const parsed = TaskPlanSchema.parse(JSON.parse(response.choice));

  const subtasks: Subtask[] = decomposeRuleBased(objective, context);
  return { subtasks };
}

/**
 * Rule-based fallback decomposition. Each goal keyword triggers specific agents.
 */
function decomposeRuleBased(
  objective: string,
  _context?: Record<string, unknown>
): Subtask[] {
  const lower = objective.toLowerCase();
  const subtasks: Subtask[] = [];
  let order = 0;

  // Compliance check always runs first if there's content to check
  if (lower.includes("compliance") || lower.includes("regulation") ||
      lower.includes("legal") || lower.includes("cfpb") || lower.includes("fomc")) {
    subtasks.push({
      agentName: "Compliance",
      recommendedModel: "anthropic/claude-3.5-sonnet",
      description: "Review content for regulatory and compliance issues",
      payload: { content: objective, checkType: "general" },
      order: order++,
    });
  }

  // Research for informational goals
  if (lower.includes("research") || lower.includes("investigate") ||
      lower.includes("find") || lower.includes("analyze") ||
      lower.includes("market") || lower.includes("competitive")) {
    subtasks.push({
      agentName: "Researcher",
      recommendedModel: "meta-llama/llama-3.1-8b-instruct",
      description: "Research and gather information",
      payload: { query: objective },
      dependsOn: getFirstTask(subtasks),
      order: order++,
    });
  }

  // Copywriting for content generation goals
  if (lower.includes("write") || lower.includes("generate") ||
      lower.includes("draft") || lower.includes("create") ||
      lower.includes("content") || lower.includes("email") ||
      lower.includes("report") || lower.includes("article")) {
    const researchTask = subtasks.find(t => t.agentName === "Researcher");
    subtasks.push({
      agentName: "Copywriter",
      recommendedModel: "meta-llama/llama-3.1-8b-instruct",
      description: "Generate content based on research and objectives",
      payload: { topic: objective, tone: "professional" },
      dependsOn: researchTask?.id,
      order: order++,
    });
  }

  // If no agents matched, default to Researcher
  if (subtasks.length === 0) {
    subtasks.push({
      agentName: "Researcher",
      recommendedModel: "meta-llama/llama-3.1-8b-instruct",
      description: `Research: ${objective}`,
      payload: { query: objective },
      order: order++,
    });
  }

  return subtasks;
}

function getFirstTask(subtasks: Subtask[]): string | undefined {
  return subtasks[0]?.id;
}
