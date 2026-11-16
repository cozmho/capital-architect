import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import LeadsTableLive from "../lead-scoring/leads-table-live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminScoringPage() {
	// Verify user is authenticated
	await auth();

	// Keep CI/build environments working when DATABASE_URL is not configured.
	if (!process.env.DATABASE_URL) {
		return (
			<main className="min-h-screen bg-[#060A14] px-6 py-10 text-zinc-100">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8">
						<h1 className="text-4xl font-bold text-[#C8A84B]">God-Mode Dashboard</h1>
						<p className="mt-2 text-zinc-400">Fundability scoring and tier routing</p>
					</header>

					<section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
						<p className="text-sm text-zinc-300">
							DATABASE_URL is not configured for this environment.
						</p>
					</section>
				</div>
			</main>
		);
	}

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

	const initialLeads = leads.map((lead) => ({
		...lead,
		createdAt: lead.createdAt.toISOString(),
	}));

	return (
		<main className="min-h-screen bg-[#060A14] px-6 py-10 text-zinc-100">
			<div className="mx-auto max-w-7xl">
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-[#C8A84B]">God-Mode Dashboard</h1>
					<p className="mt-2 text-zinc-400">Fundability scoring and tier routing</p>
				</header>

				<LeadsTableLive initialLeads={initialLeads} />
			</div>
		</main>
	);
}
