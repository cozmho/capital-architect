import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

const prisma = getPrismaClient();

export async function GET() {
  try {
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
