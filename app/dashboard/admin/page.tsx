import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminDashboardPage() {
  noStore();
  let leads: any[] = [];
  let dbConnected = false;

  try {
    if (process.env.DATABASE_URL) {
      // Fetch newest leads first
      leads = await prisma.capitalLead.findMany({
        orderBy: { createdAt: 'desc' },
      });
      dbConnected = true;
    }
  } catch (error) {
    console.error("Failed to connect to Prisma:", error);
  }

  // Calculate some basic God Mode stats if DB is connected
  const totalLeads = leads.length;
  const tierA = leads.filter((l) => l.tier === "A").length;
  const paidLeads = leads.filter((l) => l.hasPaid).length;

  return (
    <div className="dash-container" style={{ maxWidth: "1200px" }}>
      <div className="dash-header">
        <h1>God Mode</h1>
        <p className="dash-sub">
          Master view of all prospect data, Verdic scores, and revenue.
        </p>
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
                {totalLeads}
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
                          <strong style={{ display: "block", marginBottom: "4px", color: "var(--gold)" }}>{lead.fullName}</strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)" }}>{lead.email}</span>
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
                            <strong>{lead.score}</strong>
                          </div>
                          {lead.hasMetro2Errors && (
                            <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", color: "var(--red)", background: "rgba(226,75,74,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                              Metro 2 Error Flag
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "16px 28px" }}>
                          {lead.hasPaid ? (
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
        </>
      )}
    </div>
  );
}
