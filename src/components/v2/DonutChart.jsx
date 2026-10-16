const RADIUS = 15.915; // circumference ≈ 100, so dash lengths read as percentages

// segments: [{ label, value, color }] drawn in order around the ring.
// legend: [{ label, value, color }] listed under the ring (may include non-ring rows).
export const DonutChart = ({ title, segments, legend, centerValue, centerLabel }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const arcs = segments.reduce((result, segment) => {
    const start = result.length ? result[result.length - 1].end : 0;
    const pct = total > 0 ? (segment.value / total) * 100 : 0;
    return [...result, { ...segment, pct, start, end: start + pct }];
  }, []);

  return (
    <div className="wtv2-donut-card">
      <h3 className="wtv2-donut-title">{title}</h3>
      <div className="wtv2-donut-ring">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r={RADIUS} fill="transparent" stroke="#e2e8f0" strokeWidth="4.2" />
          {arcs
            .filter((arc) => arc.pct > 0)
            .map((arc) => (
              <circle
                key={arc.label}
                cx="18"
                cy="18"
                r={RADIUS}
                fill="transparent"
                stroke={arc.color}
                strokeWidth="4.2"
                strokeDasharray={`${arc.pct} ${100 - arc.pct}`}
                strokeDashoffset={-arc.start}
              />
            ))}
        </svg>
        <div className="wtv2-donut-center">
          <span className="wtv2-donut-center-value">{centerValue}</span>
          <span className="wtv2-donut-center-label">{centerLabel}</span>
        </div>
      </div>
      <ul className="wtv2-donut-legend">
        {legend.map((row) => (
          <li key={row.label}>
            <span>
              <span className="wtv2-legend-dot" style={{ background: row.color }} />
              {row.label}
            </span>
            <strong>{row.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;
