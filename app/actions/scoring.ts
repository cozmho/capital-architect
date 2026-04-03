"use server";

import { getPrismaClient } from "@/lib/prisma";
import { redirect } from "next/navigation";

const prisma = getPrismaClient();

type ScoringInput = {
  metro2ErrorCount?: number | null;
  recentInquiries?: number | null;
  entityType?: string | null;
};

export async function calculateFundabilityScore(input: ScoringInput): Promise<number> {
  let score = 100;

  // Deduct 15 points per Metro 2 error
  if (input.metro2ErrorCount) {
    score -= input.metro2ErrorCount * 15;
  }

  // Deduct points based on recent inquiries
  if (input.recentInquiries !== null && input.recentInquiries !== undefined) {
    if (input.recentInquiries > 4) {
      score -= 20;
    } else if (input.recentInquiries >= 2 && input.recentInquiries <= 4) {
      score -= 10;
    }
  }

  // Add points based on entity type
  if (input.entityType === "LLC") {
    score += 10;
  } else if (input.entityType === "Private Trust") {
    score += 15;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

type IntakePayload = {
  businessName: string;
  email?: string;
  phone?: string;
  recentInquiries: number;
  metro2ErrorCount: number;
  entityType: string;
};

export async function processIntake(payload: IntakePayload): Promise<void> {
  try {
    // Calculate fundability score with baseline algorithm
    let fundabilityScore = 100;

    // Deduct 10 points for every Metro 2 error
    fundabilityScore -= payload.metro2ErrorCount * 10;

    // Deduct 15 points if recent inquiries > 4
    if (payload.recentInquiries > 4) {
      fundabilityScore -= 15;
    }

    // Add 20 points if entityType is "Private Trust" or "LLC"
    if (payload.entityType === "Private Trust" || payload.entityType === "LLC") {
      fundabilityScore += 20;
    }

    // Clamp score to 0-100
    fundabilityScore = Math.max(0, Math.min(100, fundabilityScore));

    // Determine tier based on score
    let tier: string;
    if (fundabilityScore >= 80) {
      tier = "A";
    } else if (fundabilityScore >= 65) {
      tier = "B";
    } else {
      tier = "C";
    }

    // `email` is indexed but not unique, so use find/update-or-create instead of upsert.
    const resolvedEmail =
      payload.email || `${payload.businessName.toLowerCase().replace(/\s/g, "-")}@placeholder.com`;

    const existingLead = await prisma.lead.findFirst({
      where: {
        email: resolvedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingLead) {
      await prisma.lead.update({
          where: {
            id: existingLead.id,
          },
          data: {
            businessName: payload.businessName,
            phone: payload.phone,
            recentInquiries: payload.recentInquiries,
            metro2ErrorCount: payload.metro2ErrorCount,
            entityType: payload.entityType,
            fundabilityScore,
            tier,
            status: "INTAKE_COMPLETE",
          },
        });
    } else {
      await prisma.lead.create({
        data: {
          businessName: payload.businessName,
          email: resolvedEmail,
          phone: payload.phone,
          recentInquiries: payload.recentInquiries,
          metro2ErrorCount: payload.metro2ErrorCount,
          entityType: payload.entityType,
          fundabilityScore,
          tier,
          status: "INTAKE_COMPLETE",
          source: "client_dashboard",
        },
      });
    }
  } catch (error) {
    console.error("Intake processing error:", error);
    throw new Error("Failed to process intake");
  }

  if (payload.metro2ErrorCount > 0) {
    redirect("/dashboard/client/letter-preview");
  }

  redirect("/dashboard/client/entity-setup");
}
