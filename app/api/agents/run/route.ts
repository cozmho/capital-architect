import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPrismaClient } from "@/lib/prisma";
import { command } from "@/lib/agents/commander";
import { researcherWorker, copywriterWorker, complianceWorker } from "@/lib/agents/workers";
import { type TaskPlan, type Subtask, type RunStatus, type TaskStatus } from "@/lib/agents/schemas";
import { PrismaClient } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/client";

// ─── Dependency-aware ordering ──────────────────────────────────────────

function topologicalSort(subtasks: Subtask[]): Subtask[] {
  const resolved = new Set<string>();
  const result: Subtask[] = [];
  const byId = new Map(subtasks.map((t) => [t.id, t]));
  const maxPasses = subtasks.length + 1;
  let passes = 0;

  while (result.length < subtasks.length && passes < maxPasses) {
    passes++;
    for (const task of subtasks) {
      if (result.includes(task)) continue;
      const depSatisfied =
        !task.dependsOn || (resolved.has(task.dependsOn) || !byId.has(task.dependsOn));
      if (depSatisfied) {
        result.push(task);
        resolved.add(task.id);
      }
    }
  }

  for (const task of subtasks) {
    if (!result.includes(task)) result.push(task);
  }

  result.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.id.localeCompare(b.id);
  });

  return result;
}

// ─── Prisma persistence helpers ──────────────────────────────────────────

async function createRun(prisma: PrismaClient, objective: string): Promise<string> {
  const run = await prisma.agentRun.create({
    data: { objective, status: "PENDING" as RunStatus },
  });
  return run.id;
}

async function markRunRunning(prisma: PrismaClient, runId: string): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: { status: "RUNNING" as RunStatus },
  });
}

async function markRunCompleted(
  prisma: PrismaClient,
  runId: string,
  costEstimate = 0,
  totalTokens = 0,
): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: {
      status: "COMPLETED" as RunStatus,
      costEstimate,
      totalTokens,
      completedAt: new Date(),
    },
  });
}

async function markRunFailed(prisma: PrismaClient, runId: string, error: string): Promise<void> {
  await prisma.agentRun.update({
    where: { id: runId },
    data: {
      status: "FAILED" as RunStatus,
      completedAt: new Date(),
    },
  });
  await prisma.agentTaskLog.create({
    data: { runId, message: `Run failed: ${error}`, level: "ERROR" as const },
  });
}

async function createTask(
  prisma: PrismaClient,
  runId: string,
  subtask: Subtask,
): Promise<string> {
  const task = await prisma.agentTask.create({
    data: {
      runId,
      agentName: subtask.agentName,
      model: subtask.recommendedModel,
      description: subtask.description,
      input: subtask.payload as InputJsonValue,
      status: "PENDING" as TaskStatus,
      order: subtask.order,
      dependsOn: subtask.dependsOn ?? null,
    },
  });
  return task.id;
}

async function markTaskRunning(prisma: PrismaClient, taskId: string): Promise<void> {
  await prisma.agentTask.update({
    where: { id: taskId },
    data: { status: "RUNNING" as TaskStatus, startedAt: new Date() },
  });
}

async function markTaskCompleted(
  prisma: PrismaClient,
  taskId: string,
  output: InputJsonValue,
  tokensUsed = 0,
): Promise<void> {
  await prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status: "COMPLETED" as TaskStatus,
      output,
      tokensUsed,
      completedAt: new Date(),
    },
  });
}

async function markTaskFailed(
  prisma: PrismaClient,
  taskId: string,
  error: string,
): Promise<void> {
  await prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status: "FAILED" as TaskStatus,
      error,
      completedAt: new Date(),
    },
  });
}

async function logEvent(
  prisma: PrismaClient,
  runId: string,
  message: string,
  level: "INFO" | "DEBUG" | "WARN" | "ERROR" = "INFO",
  taskId?: string,
): Promise<void> {
  await prisma.agentTaskLog.create({
    data: { runId, taskId: taskId ?? null, message, level: level as "INFO" | "DEBUG" | "WARN" | "ERROR" },
  });
}

// ─── Worker dispatch ─────────────────────────────────────────────────────

async function executeWorker(
  subtask: Subtask,
  prisma: PrismaClient,
  runId: string,
  taskId: string,
): Promise<{ output: InputJsonValue; tokensUsed: number }> {
  const workerInput = subtask.payload as Record<string, unknown>;

  logEvent(prisma, runId, `Executing ${subtask.agentName} task: ${subtask.description}`, "DEBUG", taskId);

  let result: InputJsonValue;
  let tokensUsed = 0;

  try {
    switch (subtask.agentName) {
      case "Researcher": {
        const typedInput: Parameters<typeof researcherWorker>[0] = {
          query: workerInput.query as string,
          context: workerInput.context as Record<string, unknown> | undefined,
          focusAreas: workerInput.focusAreas as string[] | undefined,
        };
        const output = await researcherWorker(typedInput, subtask.recommendedModel);
        result = {
          findings: output.findings,
          summary: output.summary,
          followUpQuestions: output.followUpQuestions,
        } as InputJsonValue;
        break;
      }
      case "Copywriter": {
        const typedInput: Parameters<typeof copywriterWorker>[0] = {
          topic: workerInput.topic as string,
          tone: (workerInput.tone as "professional" | "casual" | "technical" | "persuasive") ?? "professional",
          audience: workerInput.audience as string | undefined,
          length: (workerInput.length as "short" | "medium" | "long") ?? "medium",
          sourceMaterial: workerInput.sourceMaterial as Record<string, unknown> | undefined,
        };
        const output = await copywriterWorker(typedInput, subtask.recommendedModel);
        result = {
          content: output.content,
          wordCount: output.wordCount,
          tone: output.tone,
          suggestions: output.suggestions,
        } as InputJsonValue;
        break;
      }
      case "Compliance": {
        const typedInput: Parameters<typeof complianceWorker>[0] = {
          content: workerInput.content as string,
          checkType: (workerInput.checkType as "cfpb" | "fomc" | "disclaimer" | "general") ?? "general",
          jurisdiction: workerInput.jurisdiction as string ?? "US",
        };
        const output = await complianceWorker(typedInput, subtask.recommendedModel);
        result = {
          status: output.status,
          issues: output.issues,
          summary: output.summary,
          approved: output.approved,
        } as InputJsonValue;
        break;
      }
      default:
        throw new Error(`Unknown agent: ${subtask.agentName}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logEvent(prisma, runId, `Worker ${subtask.agentName} failed: ${message}`, "ERROR", taskId);
    throw new Error(message);
  }

  logEvent(prisma, runId, `${subtask.agentName} task completed`, "INFO", taskId);
  return { output: result, tokensUsed };
}

// ─── Endpoint ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let objective: string;
  let context: Record<string, unknown> = {};

  try {
    const body = (await request.json()) as {
      objective?: string;
      context?: Record<string, unknown>;
    };
    objective = (body.objective ?? "").trim();
    context = body.context ?? {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!objective) {
    return NextResponse.json({ error: "objective is required" }, { status: 400 });
  }

  const prisma = getPrismaClient();
  let runId: string;

  try {
    runId = await createRun(prisma, objective);
    logEvent(prisma, runId, `Run created for objective: "${objective}"`, "INFO");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create run";
    console.error("[agents/run] Create run failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    // ── Step 1: Decompose ──────────────────────────────────────────────
    logEvent(prisma, runId, "Decomposing objective with commander", "INFO");
    await markRunRunning(prisma, runId);

    let plan: TaskPlan;
    try {
      plan = await command(objective, context);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Commander failed";
      logEvent(prisma, runId, `Commander error: ${message}`, "ERROR");
      await markRunFailed(prisma, runId, message);
      return NextResponse.json(
        { error: message, runId },
        { status: 500 },
      );
    }

    logEvent(
      prisma,
      runId,
      `Commander produced ${plan.subtasks.length} subtasks`,
      "INFO",
    );

    // ── Step 2: Persist tasks ──────────────────────────────────────────
    const orderedTasks = topologicalSort(plan.subtasks);
    const taskIds = new Map<string, string>();

    for (const subtask of orderedTasks) {
      const taskId = await createTask(prisma, runId, subtask);
      taskIds.set(subtask.id, taskId);
      logEvent(
        prisma,
        runId,
        `Created task ${taskId.slice(0, 8)}: [${subtask.agentName}] ${subtask.description}`,
        "DEBUG",
      );
    }

    // ── Step 3: Execute tasks ──────────────────────────────────────────
    let totalTokens = 0;
    let costEstimate = 0;
    const subtaskResults: Array<{
      taskId: string;
      agentName: string;
      description: string | null;
      status: TaskStatus;
      input: InputJsonValue;
      output: InputJsonValue | null;
      error: string | null;
      tokensUsed: number;
      order: number;
      dependsOn: string | null;
      startedAt: Date | null;
      completedAt: Date | null;
    }> = [];

    for (const subtask of orderedTasks) {
      const taskId = taskIds.get(subtask.id)!;

      await markTaskRunning(prisma, taskId);

      try {
        const { output, tokensUsed } = await executeWorker(
          subtask,
          prisma,
          runId,
          taskId,
        );
        totalTokens += tokensUsed;
        costEstimate += estimateCost(subtask.recommendedModel, tokensUsed);

        await markTaskCompleted(prisma, taskId, output, tokensUsed);

        subtaskResults.push({
          taskId,
          agentName: subtask.agentName,
          description: subtask.description,
          status: "COMPLETED",
          input: subtask.payload as InputJsonValue,
          output: output as InputJsonValue,
          error: null,
          tokensUsed,
          order: subtask.order,
          dependsOn: subtask.dependsOn ?? null,
          startedAt: new Date(),
          completedAt: new Date(),
        });

        logEvent(
          prisma,
          runId,
          `${subtask.agentName} task succeeded (${tokensUsed} tokens)`,
          "INFO",
          taskId,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Task failed";
        await markTaskFailed(prisma, taskId, message);

        subtaskResults.push({
          taskId,
          agentName: subtask.agentName,
          description: subtask.description,
          status: "FAILED",
          input: subtask.payload as InputJsonValue,
          output: null,
          error: message,
          tokensUsed: 0,
          order: subtask.order,
          dependsOn: subtask.dependsOn ?? null,
          startedAt: new Date(),
          completedAt: new Date(),
        });

        logEvent(prisma, runId, `${subtask.agentName} task failed: ${message}`, "ERROR", taskId);
      }
    }

    const completedCount = subtaskResults.filter((r) => r.status === "COMPLETED").length;
    const failedCount = subtaskResults.filter((r) => r.status === "FAILED").length;

    logEvent(
      prisma,
      runId,
      `Run complete: ${completedCount} succeeded, ${failedCount} failed, ${totalTokens} total tokens`,
      failedCount > 0 ? "WARN" : "INFO",
    );

    // ── Step 4: Finalize run ───────────────────────────────────────────
    if (failedCount > 0) {
      await markRunFailed(prisma, runId, `${failedCount} subtask(s) failed`);
      return NextResponse.json(
        {
          runId,
          status: "FAILED",
          objective,
          subtasks: subtaskResults,
          completedSubtasks: completedCount,
          failedSubtasks: failedCount,
          totalTokens,
          costEstimate,
        },
        { status: 200 },
      );
    }

    await markRunCompleted(prisma, runId, costEstimate, totalTokens);

    return NextResponse.json(
      {
        runId,
        status: "COMPLETED",
        objective,
        subtasks: subtaskResults,
        completedSubtasks: completedCount,
        failedSubtasks: failedCount,
        totalTokens,
        costEstimate,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Execution failed";
    console.error("[agents/run] Execution error:", err);
    try {
      await markRunFailed(prisma, runId, message);
    } catch {
      // Best-effort log update
    }
    return NextResponse.json({ error: message, runId }, { status: 500 });
  }
}

function estimateCost(model: string, tokens: number): number {
  if (tokens === 0) return 0;
  return Math.round((tokens / 1_000_000) * 3.5 * 100) / 100;
}
