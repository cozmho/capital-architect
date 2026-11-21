/**
 * lib/agents/client.ts — Client-side fetch wrapper for the agent run API.
 *
 * Usage:
 *   import { runAgent, getAgentRun } from '@/lib/agents/client';
 *   const result = await runAgent("Research credit trends", { region: "US" });
 */

export type AgentRunResult = {
  runId: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  objective: string;
  subtasks: AgentTaskResult[];
  completedSubtasks: number;
  failedSubtasks: number;
  totalTokens: number;
  costEstimate: number;
  error?: string;
  completedAt: Date | null;
};

export type AgentTaskResult = {
  taskId: string;
  agentName: "Researcher" | "Copywriter" | "Compliance";
  description: string | null;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  tokensUsed: number;
  order: number;
  dependsOn: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
};

export async function runAgent(
  objective: string,
  context?: Record<string, unknown>,
): Promise<AgentRunResult> {
  const res = await fetch("/api/agents/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  // Parse dates from strings
  if (data.completedAt) {
    data.completedAt = new Date(data.completedAt);
  }
  data.subtasks.forEach((t: AgentTaskResult) => {
    if (t.startedAt) t.startedAt = new Date(t.startedAt);
    if (t.completedAt) t.completedAt = new Date(t.completedAt);
  });
  return data as AgentRunResult;
}

export async function getAgentRun(runId: string): Promise<AgentRunResult> {
  const res = await fetch(`/api/agents/run?id=${runId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Run not found" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (data.completedAt) {
    data.completedAt = new Date(data.completedAt);
  }
  data.subtasks.forEach((t: AgentTaskResult) => {
    if (t.startedAt) t.startedAt = new Date(t.startedAt);
    if (t.completedAt) t.completedAt = new Date(t.completedAt);
  });
  return data as AgentRunResult;
}