import { getPrismaClient } from "@/lib/prisma";

export type StatusLevel = "pass" | "warn" | "fail";

export type StatusCheckItem = {
  name: string;
  status: StatusLevel;
  message: string;
};

export type StatusCheckResult = {
  overall: StatusLevel;
  checks: StatusCheckItem[];
  generatedAt: string;
};

function getOverall(checks: StatusCheckItem[]): StatusLevel {
  if (checks.some((check) => check.status === "fail")) return "fail";
  if (checks.some((check) => check.status === "warn")) return "warn";
  return "pass";
}

function canTreatMissingDbAsWarning(): boolean {
  // Keep PR CI and local smoke checks stable when a DB is intentionally not configured.
  if (process.env.CI === "true") return true;
  if (process.env.VERCEL === "1") return false;
  if (process.env.NODE_ENV !== "production") return true;
  return true;
}

export async function runStatusCheck(): Promise<StatusCheckResult> {
  const checks: StatusCheckItem[] = [];

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    checks.push({
      name: "database-url",
      status: canTreatMissingDbAsWarning() ? "warn" : "fail",
      message: "DATABASE_URL is not configured",
    });
  } else {
    checks.push({
      name: "database-url",
      status: "pass",
      message: "DATABASE_URL is configured",
    });

    try {
      const prisma = getPrismaClient();
      await prisma.$queryRawUnsafe("SELECT 1");

      checks.push({
        name: "database-connection",
        status: "pass",
        message: "Database ping succeeded",
      });

      const leadCount = await prisma.lead.count();
      checks.push({
        name: "lead-data",
        status: "pass",
        message: `Lead table reachable (${leadCount} records)`,
      });
    } catch {
      checks.push({
        name: "database-connection",
        status: "fail",
        message: "Database ping failed",
      });
    }
  }

  const clerkPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  if (!clerkPublishable || !clerkSecret) {
    checks.push({
      name: "clerk-env",
      status: "warn",
      message: "Clerk environment keys are incomplete",
    });
  } else {
    checks.push({
      name: "clerk-env",
      status: "pass",
      message: "Clerk environment keys are present",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    checks.push({
      name: "gemini-env",
      status: "warn",
      message: "GEMINI_API_KEY is not configured; deterministic fallback mode only",
    });
  } else {
    checks.push({
      name: "gemini-env",
      status: "pass",
      message: "GEMINI_API_KEY is configured",
    });
  }

  return {
    overall: getOverall(checks),
    checks,
    generatedAt: new Date().toISOString(),
  };
}
