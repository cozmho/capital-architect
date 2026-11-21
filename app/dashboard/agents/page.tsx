"use client";

import { useState } from "react";
import { Play, StopCircle, CheckCircle, XCircle, Clock, Brain, FileText, Shield } from "lucide-react";
import { runAgent, type AgentRunResult, type AgentTaskResult } from "@/lib/agents/client";

// ─── Starnet CRT/Amber Phosphor Visual Style ─────────────────────────────────
// Colors inspired by Starnet's industrial aesthetic:
// - Primary: amber-gold #ffd34a (status, accents)
// - Background: dark slate #10191b (panels)
// - Border: muted bronze #877957
// - Text: warm cream #d8ceae
// - Success: green #7bc88a
// - Warning: amber #d99a5a
// - Error: red #cf7d96
// - Info: blue #6fb3bf

const STATUS_COLORS = {
  PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  RUNNING: "bg-amber-500/20 text-amber-300 border-amber-400",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500",
  FAILED: "bg-red-500/20 text-red-400 border-red-500",
};

const AGENT_COLORS = {
  Researcher: "bg-blue-500/20 text-blue-400",
  Copywriter: "bg-purple-500/20 text-purple-400",
  Compliance: "bg-emerald-500/20 text-emerald-400",
};

function StatusPill({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${colorClass}`}
    >
      {status === "RUNNING" && <Clock className="h-3 w-3 animate-spin" />}
      {status === "COMPLETED" && <CheckCircle className="h-3 w-3" />}
      {status === "FAILED" && <XCircle className="h-3 w-3" />}
      {status === "PENDING" && <Clock className="h-3 w-3" />}
      {status}
    </span>
  );
}

function AgentIcon({ agentName }: { agentName: string }) {
  const icons: Record<string, React.ElementType> = {
    Researcher: Brain,
    Copywriter: FileText,
    Compliance: Shield,
  };
  const Icon = icons[agentName] || Brain;
  return <Icon className="h-3 w-3" />;
}

export default function AgentsDashboardPage() {
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AgentRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!objective.trim()) return;

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const data = await runAgent(objective.trim(), Object.keys(context).length > 0 ? context : undefined);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    if (!result?.runId) return;
    // Note: There's no cancel endpoint yet - this would need backend support
    setIsRunning(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-amber-300">Agent Console</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Decompose objectives into specialized agent tasks
        </p>
      </div>

      {/* Objective Input Form - Starnet style */}
      <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
        <label className="mb-2 block text-sm font-medium text-zinc-300">Objective</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Enter a task for the agent team to execute..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 shadow-[0_0_10px_rgba(255,211,74,0.05)] focus:border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          rows={3}
        />

        {/* Context fields (optional) */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Region (optional)</label>
            <input
              type="text"
              value={(context as { region?: string }).region || ""}
              onChange={(e) => setContext({ ...context, region: e.target.value })}
              placeholder="e.g., US, EU"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Focus Areas (optional)</label>
            <input
              type="text"
              value={(context as { focusAreas?: string }).focusAreas || ""}
              onChange={(e) => setContext({ ...context, focusAreas: e.target.value })}
              placeholder="Comma-separated"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || !objective.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 shadow-[0_0_10px_rgba(255,211,74,0.2)] hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Executing..." : "Run Agent Team"}
          </button>
          {isRunning && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
            >
              <StopCircle className="h-4 w-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">Run Results</h2>
              <StatusPill status={result.status} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-zinc-400">Run ID</p>
                <p className="font-mono text-amber-300 text-xs">{result.runId.slice(0, 12)}...</p>
              </div>
              <div>
                <p className="text-zinc-400">Subtasks</p>
                <p className="text-zinc-100">{result.subtasks.length} total</p>
              </div>
              <div>
                <p className="text-zinc-400">Tokens</p>
                <p className="text-zinc-100">{result.totalTokens.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Subtasks List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-300">Task Execution</h3>

            {result.subtasks.map((task, idx) => (
              <SubtaskCard key={task.taskId} task={task} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SubtaskCard({ task, index }: { task: AgentTaskResult; index: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition hover:shadow-[0_0_15px_rgba(255,211,74,0.1)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500">#{index + 1}</span>
            <StatusPill status={task.status} />
          </div>
          <h4 className="text-sm font-medium text-zinc-100 mb-1">{task.description}</h4>

          {/* Agent Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${AGENT_COLORS[task.agentName as keyof typeof AGENT_COLORS]}`}
          >
            <AgentIcon agentName={task.agentName} />
            {task.agentName}
          </span>

          {/* Task Details - Researcher Output */}
          {task.status === "COMPLETED" && task.output && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-300">
                Show details
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs">
                <code>{JSON.stringify(task.output, null, 2)}</code>
              </pre>
            </details>
          )}

          {/* Error */}
          {task.status === "FAILED" && task.error && (
            <p className="mt-2 text-xs text-red-300">{task.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}