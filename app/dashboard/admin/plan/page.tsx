import Link from "next/link";

export default function BusinessPlanPage() {
  return (
    <div className="dash-container" style={{ maxWidth: "1200px" }}>
      <div className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Business Brain</h1>
          <p className="dash-sub">
            Your live operational business plan.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard/admin" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600" }}>
            ← Back to Pipeline
          </Link>
          <a href="https://canva.link/h1fgj3kpq6l4tnm" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--gold)", color: "var(--bg1)", textDecoration: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600" }}>
            Open in Canva
          </a>
        </div>
      </div>

      <div className="dash-card dash-full-width" style={{ padding: "0", height: "calc(100vh - 200px)", minHeight: "600px", overflow: "hidden" }}>
        <iframe
          loading="lazy"
          style={{ width: "100%", height: "100%", border: "none" }}
          src="https://www.canva.com/design/DAG98pR87NU/3cq7eycQGJbHqyrZwoj6Zg/view?embed"
          allowFullScreen={true}
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  );
}
