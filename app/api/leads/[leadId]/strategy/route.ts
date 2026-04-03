import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserRole,
  hasValidClerkPublishableKey,
  hasValidClerkSecretKey,
  parseGodModeUserIds,
} from "@/lib/clerk-utils";
import { generateLeadStrategy } from "@/lib/lead-strategy";
import { getPrismaClient } from "@/lib/prisma";

const godModeUserIds = parseGodModeUserIds();

function isAdminAccess(sessionClaims: Record<string, unknown> | null, userId: string | null | undefined): boolean {
  const role = getUserRole(sessionClaims);
  return role === "admin" || Boolean(userId && godModeUserIds.has(userId));
}

export async function POST(_request: Request, context: { params: Promise<{ leadId: string }> }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  const secretKey = process.env.CLERK_SECRET_KEY ?? "";

  if (!hasValidClerkPublishableKey(publishableKey) || !hasValidClerkSecretKey(secretKey)) {
    return NextResponse.json({ error: "Clerk is not configured" }, { status: 503 });
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminAccess(sessionClaims as Record<string, unknown> | null, userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { leadId } = await context.params;
  if (!leadId) {
    return NextResponse.json({ error: "leadId is required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }

  const prisma = getPrismaClient();
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      businessName: true,
      ownerName: true,
      email: true,
      phone: true,
      ficoScore: true,
      monthlyRevenue: true,
      timeInBusiness: true,
      tier: true,
      status: true,
      notes: true,
      metro2ErrorCount: true,
      hasIdentityTheftBlock: true,
      complianceStatus: true,
      chase524Count: true,
      recentInquiries: true,
      entityType: true,
      fundabilityScore: true,
    },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const result = await generateLeadStrategy(lead, process.env.GEMINI_API_KEY);

  return NextResponse.json({
    leadId: lead.id,
    strategy: result.strategy,
    source: result.source,
  });
}
