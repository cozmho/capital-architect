import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";

type IntakePayload = {
  leadName?: string;
  businessName?: string;
  ficoBand?: string;
  utilizationBand?: string;
  bankruptcy?: string;
  recentLates?: string;
  sourceLeadId?: string;
  source?: string;
};

type IntakeSource = "website" | "google" | "calendly" | "unknown";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeYesNo(value?: string): "yes" | "no" | "unknown" {
  if (!value) return "unknown";
  const normalized = normalizeText(value);
  if (["yes", "y", "true"].includes(normalized)) return "yes";
  if (["no", "n", "false"].includes(normalized)) return "no";
  return "unknown";
}

function parseFicoBand(value?: string): number | null {
  if (!value) return null;
  const normalized = normalizeText(value);

  if (normalized.includes("720")) return 720;
  if (normalized.includes("680")) return 680;
  if (normalized.includes("620")) return 620;
  if (normalized.includes("under 620") || normalized.includes("<620")) return 0;

  return null;
}

function parseUtilizationBand(value?: string): number | null {
  if (!value) return null;
  const normalized = normalizeText(value);

  if (normalized.includes("maxed")) return 100;
  if (normalized.includes("0-30") || normalized.includes("0 - 30")) return 30;
  if (normalized.includes("31-50") || normalized.includes("31 - 50")) return 50;
  if (normalized.includes("51-80") || normalized.includes("51 - 80")) return 80;

  return null;
}

function assignTier(payload: IntakePayload): "A" | "B" | "C" | "CHECK_MANUALLY" {
  const fico = parseFicoBand(payload.ficoBand);
  const utilization = parseUtilizationBand(payload.utilizationBand);
  const bankruptcy = normalizeYesNo(payload.bankruptcy);
  const recentLates = normalizeYesNo(payload.recentLates);

  if (bankruptcy === "yes" || recentLates === "yes") {
    return "C";
  }

  if (fico === null || utilization === null || bankruptcy === "unknown" || recentLates === "unknown") {
    return "CHECK_MANUALLY";
  }

  if (fico >= 680 && utilization <= 50) {
    return "A";
  }

  return "B";
}

function getStableLeadId(payload: IntakePayload): string {
  const businessName = payload.businessName ?? payload.leadName ?? "unknown";
  const seed = payload.sourceLeadId ?? `${businessName}|${payload.ficoBand ?? ""}|${payload.utilizationBand ?? ""}`;
  const digest = createHash("sha256").update(seed).digest("hex").slice(0, 24);
  return `intake_${digest}`;
}

function normalizeSource(value?: string): IntakeSource {
  if (!value) return "unknown";

  const normalized = normalizeText(value);
  if (normalized.includes("website") || normalized.includes("web")) return "website";
  if (normalized.includes("google") || normalized.includes("form") || normalized.includes("sheet")) return "google";
  if (normalized.includes("calendly")) return "calendly";

  return "unknown";
}

function inferSourceFromLeadId(sourceLeadId?: string): IntakeSource {
  if (!sourceLeadId) return "unknown";

  const normalized = normalizeText(sourceLeadId);
  if (normalized.includes("form") || normalized.includes("google")) return "google";
  if (normalized.includes("calendly")) return "calendly";

  return "unknown";
}

function resolveSource(payload: IntakePayload): IntakeSource {
  const explicit = normalizeSource(payload.source);
  if (explicit !== "unknown") return explicit;

  const inferred = inferSourceFromLeadId(payload.sourceLeadId);
  if (inferred !== "unknown") return inferred;

  return "website";
}

function toStatusFromSource(source: IntakeSource): string {
  if (source === "website") return "INTAKE_WEBSITE";
  if (source === "google") return "INTAKE_GOOGLE";
  if (source === "calendly") return "INTAKE_CALENDLY";
  return "INTAKE_FORM";
}

function isSameOriginBrowserRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const requestUrl = new URL(request.url);
    return origin === requestUrl.origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  const configuredApiKey = process.env.INTAKE_API_KEY;
  const requestApiKey = request.headers.get("x-intake-key");

  const isAuthorizedByApiKey = Boolean(configuredApiKey && requestApiKey === configuredApiKey);
  const isAuthorizedBrowserPost = isSameOriginBrowserRequest(request);

  if (configuredApiKey && !isAuthorizedByApiKey && !isAuthorizedBrowserPost) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: IntakePayload;
  try {
    payload = (await request.json()) as IntakePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const businessName = payload.businessName?.trim() || payload.leadName?.trim();
  if (!businessName) {
    return NextResponse.json({ error: "leadName or businessName is required" }, { status: 400 });
  }

  const tier = assignTier(payload);
  const source = resolveSource(payload);
  const status = toStatusFromSource(source);

  // Validate numeric fields before database insertion
  const adbValue = parseUtilizationBand(payload.utilizationBand) ?? 0;
  const nsfsValue = normalizeYesNo(payload.recentLates) === "yes" ? 1 : 0;

  if (!Number.isInteger(adbValue) || adbValue < 0 || adbValue > 100) {
    return NextResponse.json(
      { error: "Invalid adb value - must be integer between 0 and 100" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(nsfsValue) || (nsfsValue !== 0 && nsfsValue !== 1)) {
    return NextResponse.json(
      { error: "Invalid nsfs value - must be 0 or 1" },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.upsert({
    where: { id: getStableLeadId(payload) },
    update: {
      businessName,
      tier,
      status,
      adb: adbValue,
      nsfs: nsfsValue,
    },
    create: {
      id: getStableLeadId(payload),
      businessName,
      tier,
      status,
      adb: adbValue,
      nsfs: nsfsValue,
    },
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    assignedTier: lead.tier,
    source,
  });
}
