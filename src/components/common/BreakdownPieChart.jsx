import { useId, useState } from 'react';

const CENTER_X = 230;
const CENTER_Y = 150;
const RADIUS = 75;
const ELBOW_OFFSET = 30;
const LABEL_LINE_LENGTH = 40;

// "basicCard" -> "Basic Card"
const formatLabel = (name) =>
  name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());

const pointAt = (angle, radius) => [
  CENTER_X + radius * Math.cos(angle),
  CENTER_Y + radius * Math.sin(angle),
];

const VIEW_WIDTH = 460;
const TOOLTIP_HEIGHT = 50;
const TOOLTIP_ARROW = 7;

const PieTooltip = ({ arc, isFullCircle }) => {
  // Anchor at the slice's outer edge (top of the circle for a single slice).
  const angle = isFullCircle ? -Math.PI / 2 : (arc.startAngle + arc.endAngle) / 2;
  const [tipX, tipY] = pointAt(angle, RADIUS);
  const label = formatLabel(arc.name);
  const width = Math.max(label.length, String(arc.value).length) * 8 + 28;
  const boxX = Math.min(Math.max(tipX - width / 2, 0), VIEW_WIDTH - width);
  const boxY = tipY - TOOLTIP_ARROW - TOOLTIP_HEIGHT;

  return (
    <g className="wetap-pie-tooltip" pointerEvents="none">
      <rect x={boxX} y={boxY} width={width} height={TOOLTIP_HEIGHT} rx="4" fill="#404040" />
      <path
        d={`M ${tipX - TOOLTIP_ARROW} ${boxY + TOOLTIP_HEIGHT} L ${tipX} ${tipY} L ${tipX + TOOLTIP_ARROW} ${boxY + TOOLTIP_HEIGHT} Z`}
        fill="#404040"
      />
      <text x={boxX + width / 2} y={boxY + 20} fontSize="12" fill="#ffffff" textAnchor="middle">
        {label}
      </text>
      <text x={boxX + width / 2} y={boxY + 40} fontSize="15" fill="#ffffff" textAnchor="middle">
        {arc.value}
      </text>
    </g>
  );
};

export const BreakdownPieChart = ({ items }) => {
  const [hoveredName, setHoveredName] = useState(null);
  const revealMaskId = `pie-reveal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const slices = items.filter((item) => item.value > 0);
  const total = slices.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <p className="wetap-pie-empty">No data</p>;
  }

  const arcs = slices.reduce((result, item) => {
    const startAngle = result.length ? result[result.length - 1].endAngle : -Math.PI / 2;
    const endAngle = startAngle + (item.value / total) * Math.PI * 2;
    return [...result, { ...item, startAngle, endAngle }];
  }, []);

  const hoveredArc = arcs.find((arc) => arc.name === hoveredName);

  return (
    <svg
      key={arcs.map((arc) => `${arc.name}:${arc.value}`).join('|')}
      viewBox="0 0 460 300" className="wetap-pie-svg" role="img" aria-label="Breakdown chart">
      <defs>
        <radialGradient
          id="pieGradient"
          gradientUnits="userSpaceOnUse"
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
        >
          <stop offset="0%" stopColor="#efb7d4" />
          <stop offset="100%" stopColor="#e584b8" />
        </radialGradient>
        {/* A thick stroke whose dash grows from 12 o'clock reveals the slices clockwise. */}
        <mask id={revealMaskId}>
          <circle
            className="wetap-pie-reveal"
            cx={CENTER_X}
            cy={CENTER_Y}
            r={(RADIUS + 4) / 2}
            fill="none"
            stroke="#ffffff"
            strokeWidth={RADIUS + 4}
            pathLength="100"
            transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
          />
        </mask>
      </defs>

      <g mask={`url(#${revealMaskId})`}>
        {arcs.map((arc) => {
          const hoverProps = {
            className: `wetap-pie-slice${arc.name === hoveredName ? ' is-hovered' : ''}`,
            onMouseEnter: () => setHoveredName(arc.name),
            onMouseLeave: () => setHoveredName(null),
            onClick: () => setHoveredName((current) => (current === arc.name ? null : arc.name)),
          };
          if (arcs.length === 1) {
            return (
              <circle
                key={arc.name}
                cx={CENTER_X}
                cy={CENTER_Y}
                r={RADIUS}
                fill="url(#pieGradient)"
                {...hoverProps}
              />
            );
          }
          const [x1, y1] = pointAt(arc.startAngle, RADIUS);
          const [x2, y2] = pointAt(arc.endAngle, RADIUS);
          const largeArc = arc.endAngle - arc.startAngle > Math.PI ? 1 : 0;
          return (
            <path
              key={arc.name}
              d={`M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill="url(#pieGradient)"
              stroke="url(#pieGradient)"
              strokeWidth="0.5"
              strokeLinejoin="round"
              {...hoverProps}
            />
          );
        })}

      </g>

      <g className="wetap-pie-labels">
        {arcs.map((arc) => {
          // A full circle has no slice midpoint, so point its label to the lower right.
          const midAngle = arcs.length === 1 ? Math.PI / 4 : (arc.startAngle + arc.endAngle) / 2;
          const [edgeX, edgeY] = pointAt(midAngle, RADIUS);
          const [elbowX, elbowY] = pointAt(midAngle, RADIUS + ELBOW_OFFSET);
          const isRight = Math.cos(midAngle) >= 0;
          const endX = elbowX + (isRight ? LABEL_LINE_LENGTH : -LABEL_LINE_LENGTH);
          return (
            <g key={`${arc.name}-label`}>
              <polyline
                points={`${edgeX},${edgeY} ${elbowX},${elbowY} ${endX},${elbowY}`}
                fill="none"
                stroke="#e06aa6"
                strokeWidth="1"
              />
              <text
                x={endX + (isRight ? 4 : -4)}
                y={elbowY + 4}
                fontSize="12"
                fill="#111"
                textAnchor={isRight ? 'start' : 'end'}
              >
                {formatLabel(arc.name)}
              </text>
            </g>
          );
        })}
      </g>

      {hoveredArc && <PieTooltip arc={hoveredArc} isFullCircle={arcs.length === 1} />}
    </svg>
  );
};

export default BreakdownPieChart;
