import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  // Avoid crashing build/CI environments that don't have a DB configured
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503, headers: NO_STORE_HEADERS }
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

    return NextResponse.json(leads, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
