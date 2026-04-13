export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-bar-inner">
        <div className="stat-item">
          <div className="stat-number">$497</div>
          <div className="stat-label">Fundability Audit — full diagnostic</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10%</div>
          <div className="stat-label">Success fee — only pay when funded</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">0%</div>
          <div className="stat-label">Intro rate business credit available</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">3</div>
          <div className="stat-label">Funding tiers — matched to your score</div>
        </div>
      </div>
    </div>
  );
}
