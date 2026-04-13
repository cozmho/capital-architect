import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminDashboardPage({ searchParams }: {
  searchParams?: { page?: string; pageSize?: string };
}) {
  noStore();
  let leads: any[] = [];
  let dbConnected = false;
  let totalLeadsCount = 0;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;

  try {
    if (process.env.DATABASE_URL) {
      // Fetch leads with pagination
      leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });
      totalLeadsCount = await prisma.lead.count();
      dbConnected = true;
    }
  } catch (error) {
    console.error("Failed to connect to Prisma:", error);
  }

  const [tierA, paidLeads] = dbConnected
    ? await Promise.all([
        prisma.lead.count({ where: { tier: "A" } }),
        prisma.lead.count({ where: { paymentStatus: "paid" } }),
      ])
    : [0, 0];
  const totalPages = Math.ceil(totalLeadsCount / pageSize);

  return (
    <div className="dash-container" style={{ maxWidth: "1200px" }}>
      <div className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>God Mode</h1>
          <p className="dash-sub">
            Master view of all prospect data, Verdic scores, and revenue.
          </p>
        </div>
        <a href="/dashboard/admin/plan" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", border: "1px solid var(--border)" }}>
          🧠 View Business Plan
        </a>
      </div>

      {!process.env.DATABASE_URL || !dbConnected ? (
        <div className="dash-card" style={{ borderLeft: "4px solid var(--red)" }}>
          <h2 style={{ color: "var(--red)", marginBottom: "8px" }}>Database Not Connected</h2>
          <p className="dash-sub">
            Your Supabase Postgres connection is missing. Leads are currently not being saved.
          </p>
          <code style={{ display: "block", marginTop: "16px", padding: "12px", background: "rgba(0,0,0,0.5)", borderRadius: "4px", fontSize: "14px" }}>
            Add DATABASE_URL and DIRECT_URL to your environment variables to activate data tracking.
          </code>
        </div>
      ) : (
        <>
          {/* Quick Stats Pipeline */}
          <div className="dash-grid" style={{ marginBottom: "40px" }}>
            <div className="dash-card">
              <span className="score-eyebrow">TOTAL PIPELINE</span>
              <div style={{ fontSize: "40px", fontFamily: "var(--serif)", color: "var(--gold)" }}>
                {totalLeadsCount}
              </div>
              <p className="dash-sub-text">Total assessments completed</p>
            </div>
            <div className="dash-card">
              <span className="score-eyebrow">TIER A PROSPECTS</span>
              <div style={{ fontSize: "40px", fontFamily: "var(--serif)", color: "var(--green)" }}>
                {tierA}
              </div>
              <p className="dash-sub-text">Ready for capital deployment</p>
            </div>
            <div className="dash-card">
              <span className="score-eyebrow">PAID CLIENTS</span>
              <div style={{ fontSize: "40px", fontFamily: "var(--serif)", color: "var(--gold)" }}>
                {paidLeads}
              </div>
              <p className="dash-sub-text">Users who unlocked dashboard</p>
            </div>
          </div>

          {/* Master Table */}
          <div className="dash-card dash-full-width" style={{ padding: "0", overflow: "hidden" }}>
            <div className="dash-card-header" style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", margin: "0" }}>
              <h3>Pipeline Activity</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textIndent: "0", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", background: "var(--bg3)", fontSize: "13px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "16px 28px" }}>Date</th>
                    <th style={{ padding: "16px 28px" }}>Prospect</th>
                    <th style={{ padding: "16px 28px" }}>Business</th>
                    <th style={{ padding: "16px 28px" }}>Score & Tier</th>
                    <th style={{ padding: "16px 28px" }}>Paid ($350)</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px", color: "var(--text)" }}>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
                        No leads in the database yet.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "16px 28px", color: "var(--muted)" }}>
                          {lead.createdAt.toLocaleDateString()}
                        </td>
                        <td style={{ padding: "16px 28px" }}>
                          <strong style={{ display: "block", marginBottom: "4px", color: "var(--gold)" }}>{lead.ownerName || "Unknown"}</strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)" }}>{lead.email || "No email"}</span>
                          <br />
                          {lead.phone && <span style={{ fontSize: "13px", color: "var(--muted)" }}>{lead.phone}</span>}
                        </td>
                        <td style={{ padding: "16px 28px" }}>
                          {lead.businessName || <span style={{ color: "var(--muted)" }}>Pre-business</span>}
                        </td>
                        <td style={{ padding: "16px 28px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span className={`compliance-score-pill ${lead.tier === "A" ? "pass" : lead.tier === "B" ? "warning" : "fail"}`}>
                              Tier {lead.tier}
                            </span>
                            <strong>{lead.fundabilityScore || "0"}</strong>
                          </div>
                          {lead.hasMetro2Errors && (
                            <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", color: "var(--red)", background: "rgba(226,75,74,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                              Metro 2 Error Flag
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "16px 28px" }}>
                          {lead.paymentStatus === "paid" ? (
                            <span style={{ color: "var(--green)" }}>Yes</span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>No</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
              <a
                href={`/dashboard/admin?page=${Math.max(1, currentPage - 1)}&pageSize=${pageSize}`}
                style={{ padding: "8px 16px", background: "var(--bg3)", borderRadius: "4px", textDecoration: "none", color: "var(--text)", opacity: currentPage === 1 ? 0.5 : 1, pointerEvents: currentPage === 1 ? "none" : "auto" }}
              >
                Previous
              </a>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/dashboard/admin?page=${page}&pageSize=${pageSize}`}
                  style={{
                    padding: "8px 12px",
                    background: page === currentPage ? "var(--gold)" : "var(--bg3)",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: page === currentPage ? "var(--bg1)" : "var(--text)",
                    fontWeight: page === currentPage ? "bold" : "normal",
                  }}
                >
                  {page}
                </a>
              ))}
              <a
                href={`/dashboard/admin?page=${Math.min(totalPages, currentPage + 1)}&pageSize=${pageSize}`}
                style={{ padding: "8px 16px", background: "var(--bg3)", borderRadius: "4px", textDecoration: "none", color: "var(--text)", opacity: currentPage === totalPages ? 0.5 : 1, pointerEvents: currentPage === totalPages ? "none" : "auto" }}
              >
                Next
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
