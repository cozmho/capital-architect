export type { RunStatus, TaskStatus } from "./schemas";

import type { RunStatus, TaskStatus } from "./schemas";

export type AgentRunStatus = RunStatus;
export type AgentTaskStatus = TaskStatus;

export type AgentRunSummary = {
  runId: string;
  objective: string;
  status: RunStatus;
  totalSubtasks: number;
  completedSubtasks: number;
  failedSubtasks: number;
  costEstimate: number;
  totalTokens: number;
  createdAt: Date;
  completedAt: Date | null;
};

export type AgentTaskResult = {
  taskId: string;
  agentName: string;
  description: string | null;
  status: TaskStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  tokensUsed: number;
  order: number;
  dependsOn: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type ExecuteAgentRunResult = {
  runId: string;
  status: RunStatus;
  objective: string;
  subtasks: AgentTaskResult[];
  error?: string;
  completedAt: Date | null;
};
