import EmptyState from '../common/EmptyState';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DATE_RANGE = /^([A-Za-z]{3})[a-z]*\s+(\d{1,2})\s*[-–]\s*([A-Za-z]{3})[a-z]*\s+(\d{1,2})$/;

// Rough day-of-year, only used to compare two dates in the same range.
const toDayNumber = (month, day) => MONTHS.indexOf(month.toLowerCase()) * 31 + Number(day);

// A weekly label like "Oct 19 - Oct 13" becomes two lines, earliest date first: ["Oct 13", "Oct 19"].
// Anything that isn't a "Mon D - Mon D" range stays on one line.
const getLabelLines = (label) => {
  const match = label.trim().match(DATE_RANGE);
  if (!match) return [label];

  const [, startMonth, startDay, endMonth, endDay] = match;
  const start = `${startMonth} ${startDay}`;
  const end = `${endMonth} ${endDay}`;
  const gap = toDayNumber(endMonth, endDay) - toDayNumber(startMonth, startDay);
  // A small negative gap means the API wrote the range newest-first; a large one is a year wrap (Dec → Jan).
  return gap < 0 && gap > -180 ? [end, start] : [start, end];
};

// Vertical bars scaled to the largest value. items: [{ label, value }]
export const BarChart = ({ items, variant = 'purple', isLoading = false }) => {
  if (items.length === 0) {
    return (
      <div className="wtv2-bars wtv2-bars-empty">
        {!isLoading && <EmptyState subtitle="" />}
      </div>
    );
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
          <span className="wtv2-bar-label" title={item.label}>
            {getLabelLines(item.label).map((line, lineIndex) => [
              // The hyphen gets its own centered line so it doesn't push either date off-center.
              lineIndex > 0 && <span key={`${line}-sep`} className="wtv2-bar-label-sep" aria-hidden="true">-</span>,
              <span key={line} className={lineIndex > 0 ? 'wtv2-bar-label-end' : undefined}>
                {line}
              </span>,
            ])}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
