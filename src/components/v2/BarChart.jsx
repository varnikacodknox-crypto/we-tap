// Vertical bars scaled to the largest value. items: [{ label, value }]
export const BarChart = ({ items, variant = 'purple', emptyText = 'No data' }) => {
  if (items.length === 0) {
    return <div className="wtv2-bars wtv2-bars-empty">{emptyText}</div>;
  }

  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="wtv2-bars">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="wtv2-bar-col">
          <span className="wtv2-bar-value">{item.value.toLocaleString()}</span>
          <div
            className={`wtv2-bar ${variant}`}
            style={{ height: `${Math.max(4, Math.round((item.value / max) * 90))}%` }}
          />
          <span className="wtv2-bar-label" title={item.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
