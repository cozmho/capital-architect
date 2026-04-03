import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  // Avoid crashing build/CI environments that don't have a DB configured
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  try {
    const prisma = getPrismaClient();
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        businessName: true,
        ownerName: true,
        email: true,
        fundabilityScore: true,
        entityType: true,
        metro2ErrorCount: true,
        recentInquiries: true,
        complianceStatus: true,
        createdAt: true,
      },
      orderBy: {
        fundabilityScore: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
