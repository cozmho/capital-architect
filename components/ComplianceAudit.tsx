"use client";

interface CheckItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "pending";
  description: string;
}

export default function ComplianceAudit({ items }: { items: CheckItem[] }) {
  const passedCount = items.filter(i => i.status === "pass").length;
  const score = Math.round((passedCount / items.length) * 100);

  return (
    <div className="dash-card dash-full-width">
      <div className="dash-card-header">
        <div>
          <h3>Master Compliance Plan (MCP-20)</h3>
          <p className="dash-card-sub">Lender Credibility Audit — {score}% Compliant</p>
        </div>
        <div className={`compliance-score-pill ${score >= 80 ? 'pass' : score >= 60 ? 'warning' : 'fail'}`}>
          {score}%
        </div>
      </div>

      <div className="compliance-grid">
        {items.map((item) => (
          <div key={item.id} className={`compliance-item ${item.status}`}>
            <div className="compliance-item-icon">
              {item.status === "pass" ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : item.status === "fail" ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <div className="dot-pending" />
              )}
            </div>
            <div className="compliance-item-content">
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
