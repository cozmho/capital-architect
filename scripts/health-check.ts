#!/usr/bin/env ts-node

import { execSync } from "child_process";
import * as https from "https";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local for local development
config({ path: resolve(process.cwd(), ".env.local") });

interface CheckResult {
  service: string;
  status: "pass" | "fail" | "warn";
  message: string;
}

const results: CheckResult[] = [];

function exec(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (error: any) {
    return error.stdout?.trim() || error.message || "";
  }
}

function addResult(service: string, status: "pass" | "fail" | "warn", message: string) {
  results.push({ service, status, message });
}

function httpCheck(url: string): Promise<number> {
  return new Promise((resolve) => {
    https
      .get(url, { timeout: 5000 }, (res) => {
        resolve(res.statusCode || 0);
      })
      .on("error", () => resolve(0));
  });
}

async function checkSupabase() {
  console.log("\n🔍 Checking SUPABASE...");
  
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!dbUrl) {
    addResult("Supabase", "fail", "DATABASE_URL not set in environment");
  } else if (!dbUrl.includes(":5432")) {
    addResult("Supabase", "warn", "DATABASE_URL should use port 5432 (direct connection), not 6543 (pooler)");
  } else {
    addResult("Supabase", "pass", "DATABASE_URL configured with direct connection");
  }

  if (!directUrl) {
    addResult("Supabase", "warn", "DIRECT_URL not set (required for Prisma migrations)");
  } else {
    addResult("Supabase", "pass", "DIRECT_URL configured");
  }

  // Test database connection
  try {
    exec('echo "SELECT 1;" | npx prisma db execute --stdin');
    addResult("Supabase", "pass", "Database connection successful");
  } catch {
    addResult("Supabase", "fail", "Database connection failed - check credentials");
  }
}

async function checkClerk() {
  console.log("\n🔍 Checking CLERK...");
  
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!pubKey) {
    addResult("Clerk", "fail", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not set");
  } else if (pubKey.startsWith("pk_test_")) {
    addResult("Clerk", "warn", "Using TEST publishable key (pk_test_*) - switch to LIVE key");
  } else if (pubKey.startsWith("pk_live_")) {
    addResult("Clerk", "pass", "Using LIVE publishable key");
  } else {
    addResult("Clerk", "fail", "Invalid Clerk publishable key format");
  }

  if (!secretKey) {
    addResult("Clerk", "fail", "CLERK_SECRET_KEY not set");
  } else if (secretKey.startsWith("sk_test_")) {
    addResult("Clerk", "warn", "Using TEST secret key (sk_test_*) - switch to LIVE key");
  } else if (secretKey.startsWith("sk_live_")) {
    addResult("Clerk", "pass", "Using LIVE secret key");
  } else {
    addResult("Clerk", "fail", "Invalid Clerk secret key format");
  }
}

async function checkVercel() {
  console.log("\n🔍 Checking VERCEL...");
  
  // Check authentication
  const whoami = exec("npx vercel whoami 2>&1");
  if (whoami.includes("Error") || whoami.includes("not logged in")) {
    addResult("Vercel", "fail", "Not authenticated - run: npx vercel login");
    return;
  }
  addResult("Vercel", "pass", `Authenticated as: ${whoami}`);

  // Check production environment variables
  const envList = exec("npx vercel env ls production 2>&1");
  const requiredVars = [
    "DATABASE_URL",
    "DIRECT_URL", 
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "INTAKE_API_KEY"
  ];

  const missingVars: string[] = [];
  for (const varName of requiredVars) {
    if (!envList.includes(varName)) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    addResult("Vercel", "fail", `Missing production env vars: ${missingVars.join(", ")}`);
  } else {
    addResult("Vercel", "pass", "All required production env vars configured");
  }
}

async function checkGitHub() {
  console.log("\n🔍 Checking GITHUB...");
  
  // Check remote
  const remote = exec("git remote -v");
  if (!remote.includes("github.com/cozmho/capital-architect")) {
    addResult("GitHub", "fail", "Git remote not configured correctly");
  } else {
    addResult("GitHub", "pass", "Git remote configured");
  }

  // Check working tree
  const status = exec("git status --porcelain");
  if (status.length > 0) {
    addResult("GitHub", "warn", "Working tree has uncommitted changes");
  } else {
    addResult("GitHub", "pass", "Working tree clean");
  }

  // Check if latest commit is pushed
  const localCommit = exec("git rev-parse HEAD");
  const remoteCommit = exec("git rev-parse origin/main 2>&1");
  
  if (localCommit !== remoteCommit) {
    addResult("GitHub", "warn", "Local commits not pushed to origin/main - run: git push");
  } else {
    const latestCommit = exec("git log origin/main --oneline -1");
    addResult("GitHub", "pass", `Latest commit pushed: ${latestCommit}`);
  }
}

async function checkZohoMail() {
  console.log("\n🔍 Checking ZOHO MAIL...");
  
  // Check DKIM
  const dkim = exec("nslookup -type=TXT zoho._domainkey.capitalarchitect.tech 8.8.8.8 2>&1");
  if (dkim.includes("v=DKIM1")) {
    addResult("Zoho Mail", "pass", "DKIM record configured");
  } else {
    addResult("Zoho Mail", "warn", "DKIM record not found or not verified");
  }

  // Check SPF
  const spf = exec("nslookup -type=TXT capitalarchitect.tech 8.8.8.8 2>&1");
  if (spf.includes("v=spf1")) {
    addResult("Zoho Mail", "pass", "SPF record configured");
  } else {
    addResult("Zoho Mail", "fail", "SPF record missing - add TXT record with v=spf1");
  }

  // Check MX records
  const mx = exec("nslookup -type=MX capitalarchitect.tech 8.8.8.8 2>&1");
  if (mx.includes("zoho.com") || mx.includes("zohomail.com")) {
    addResult("Zoho Mail", "pass", "MX records point to Zoho");
  } else {
    addResult("Zoho Mail", "fail", "MX records not configured for Zoho");
  }
}

async function checkProductionRoutes() {
  console.log("\n🔍 Checking PRODUCTION ROUTES...");
  
  const routes = [
    { url: "https://capitalarchitect.tech", expect: 200 },
    { url: "https://capitalarchitect.tech/assess", expect: 200 },
    { url: "https://capitalarchitect.tech/api/health", expect: 200 }
  ];

  for (const route of routes) {
    const status = await httpCheck(route.url);
    if (status === route.expect) {
      addResult("Production Routes", "pass", `${route.url} → HTTP ${status}`);
    } else if (status === 0) {
      addResult("Production Routes", "fail", `${route.url} → Connection failed`);
    } else {
      addResult("Production Routes", "fail", `${route.url} → HTTP ${status} (expected ${route.expect})`);
    }
  }
}

function printResults() {
  console.log("\n═══════════════════════════════════════════");
  console.log("HEALTH CHECK RESULTS");
  console.log("═══════════════════════════════════════════\n");

  const grouped = results.reduce((acc, r) => {
    if (!acc[r.service]) acc[r.service] = [];
    acc[r.service].push(r);
    return acc;
  }, {} as Record<string, CheckResult[]>);

  for (const [service, checks] of Object.entries(grouped)) {
    const hasFailures = checks.some((c) => c.status === "fail");
    const hasWarnings = checks.some((c) => c.status === "warn");
    
    let icon = "✅";
    if (hasFailures) icon = "❌";
    else if (hasWarnings) icon = "⚠️";

    console.log(`${icon} ${service.toUpperCase()}`);
    for (const check of checks) {
      const symbol = check.status === "pass" ? "  ✓" : check.status === "warn" ? "  ⚠" : "  ✗";
      console.log(`${symbol} ${check.message}`);
    }
    console.log();
  }

  const failures = results.filter((r) => r.status === "fail").length;
  const warnings = results.filter((r) => r.status === "warn").length;

  console.log("═══════════════════════════════════════════");
  if (failures === 0 && warnings === 0) {
    console.log("SYSTEM STATUS: ALL GREEN ✅");
  } else {
    console.log(`SYSTEM STATUS: ${failures + warnings} ISSUE${failures + warnings > 1 ? "S" : ""} FOUND`);
    if (failures > 0) console.log(`  • ${failures} critical failure${failures > 1 ? "s" : ""}`);
    if (warnings > 0) console.log(`  • ${warnings} warning${warnings > 1 ? "s" : ""}`);
  }
  console.log("═══════════════════════════════════════════\n");

  process.exit(failures > 0 ? 1 : 0);
}

async function main() {
  console.log("🚀 Capital Architect - System Health Check");
  console.log("Starting comprehensive service verification...");

  await checkSupabase();
  await checkClerk();
  await checkVercel();
  await checkGitHub();
  await checkZohoMail();
  await checkProductionRoutes();

  printResults();
}

main();
