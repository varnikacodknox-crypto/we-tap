import { useEffect, useRef, useState } from 'react';

const PLOT_HEIGHT = 200;
const TOP_PADDING = 16;
const RIGHT_PADDING = 12;
const FONT_SIZE = 12;
const CHAR_WIDTH = 7; // approximate width of a 12px Poppins character
const LINE_HEIGHT = 16;
const LABEL_GAP = 10;
const AXIS_TITLE_HEIGHT = 30;
const TOOLTIP_HEIGHT = 46;

// Round a rough tick step to 1, 2 or 5 × 10ⁿ, like d3's tick algorithm.
const getNiceStep = (max, targetTickCount = 3) => {
  const rawStep = max / targetTickCount;
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const error = rawStep / power;
  if (error >= Math.sqrt(50)) return 10 * power;
  if (error >= Math.sqrt(10)) return 5 * power;
  if (error >= Math.sqrt(2)) return 2 * power;
  return power;
};

const getYAxis = (maxValue) => {
  if (maxValue <= 0) return { ticks: [0], top: 0, format: () => '0' };

  const step = getNiceStep(maxValue);
  const tickCount = Math.ceil(maxValue / step);
  const decimals = step < 1 ? Math.ceil(-Math.log10(step)) : 0;
  return {
    ticks: Array.from({ length: tickCount + 1 }, (_, index) => index * step),
    top: tickCount * step,
    format: (value) => value.toFixed(decimals),
  };
};

// Keep labels horizontal while they fit, then tilt to 45°, then stand them upright.
const getLabelLayout = (labels, slotWidth) => {
  const textWidth = Math.max(0, ...labels.map((label) => label.length)) * CHAR_WIDTH;

  if (textWidth + 8 <= slotWidth) {
    return { angle: 0, step: 1, height: LINE_HEIGHT + 4 };
  }
  if (textWidth * Math.SQRT1_2 + 4 <= slotWidth) {
    return { angle: -45, step: 1, height: (textWidth + FONT_SIZE) * Math.SQRT1_2 };
  }
  return {
    angle: -90,
    step: Math.max(1, Math.ceil(LINE_HEIGHT / slotWidth)),
    height: textWidth + 4,
  };
};

const useElementWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
};

export const LineChart = ({ points, axisLabel }) => {
  const [containerRef, width] = useElementWidth();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const labels = points.map((point) => String(point.name));
  const values = points.map((point) => Number(point.value) || 0);
  const yAxis = getYAxis(Math.max(0, ...values));

  const leftPadding =
    Math.max(...yAxis.ticks.map((tick) => yAxis.format(tick).length)) * CHAR_WIDTH + 16;
  const plotWidth = Math.max(0, width - leftPadding - RIGHT_PADDING);
  const slotWidth = points.length ? plotWidth / points.length : plotWidth;
  const labelLayout = getLabelLayout(labels, slotWidth);

  const plotTop = TOP_PADDING;
  const plotBottom = plotTop + PLOT_HEIGHT;
  const labelTop = plotBottom + LABEL_GAP;
  const height = labelTop + labelLayout.height + AXIS_TITLE_HEIGHT;

  const xAt = (index) =>
    leftPadding + (points.length > 1 ? (index * plotWidth) / (points.length - 1) : plotWidth / 2);
  // With no non-zero values there is no scale, so the zero line sits mid-plot.
  const yAt = (value) =>
    yAxis.top === 0 ? plotTop + PLOT_HEIGHT / 2 : plotBottom - (value / yAxis.top) * PLOT_HEIGHT;

  const linePath = values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(value)}`)
    .join(' ');

  const hoveredPoint = hoveredIndex === null ? null : points[hoveredIndex];

  return (
    <div ref={containerRef} className="wetap-line-chart">
      {width > 0 && points.length > 0 && (
        <svg width={width} height={height} role="img" aria-label={`${axisLabel} chart`}>
          {/* Horizontal grid lines and y-axis labels */}
          {yAxis.ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={leftPadding}
                x2={leftPadding + plotWidth}
                y1={yAt(tick)}
                y2={yAt(tick)}
                stroke="#e5e5e5"
              />
              <text
                x={leftPadding - 10}
                y={yAt(tick)}
                fontSize={FONT_SIZE}
                fill="#333"
                textAnchor="end"
                dominantBaseline="central"
              >
                {yAxis.format(tick)}
              </text>
            </g>
          ))}

          {/* Vertical grid lines and x-axis labels */}
          {labels.map((label, index) => {
            const x = xAt(index);
            const showLabel = index % labelLayout.step === 0;
            return (
              <g key={`${label}-${index}`}>
                <line x1={x} x2={x} y1={plotTop} y2={plotBottom} stroke="#e5e5e5" />
                {showLabel && labelLayout.angle === 0 && (
                  <text
                    x={x}
                    y={labelTop + FONT_SIZE}
                    fontSize={FONT_SIZE}
                    fill="#333"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                )}
                {showLabel && labelLayout.angle !== 0 && (
                  <text
                    x={x}
                    y={labelTop}
                    fontSize={FONT_SIZE}
                    fill="#333"
                    textAnchor="end"
                    dominantBaseline="central"
                    transform={`rotate(${labelLayout.angle} ${x} ${labelTop})`}
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          <path
            d={linePath}
            fill="none"
            stroke="#c86cf0"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <text
            x={leftPadding + plotWidth / 2}
            y={height - 8}
            fontSize="14"
            fill="#222"
            textAnchor="middle"
          >
            {axisLabel}
          </text>

          {/* Hover zones, one per data point */}
          {points.map((point, index) => (
            <rect
              key={`hover-${point.name}-${index}`}
              x={xAt(index) - slotWidth / 2}
              y={plotTop}
              width={slotWidth}
              height={PLOT_HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex((current) => (current === index ? null : index))}
            />
          ))}

          {hoveredPoint && (() => {
            const x = xAt(hoveredIndex);
            const y = yAt(values[hoveredIndex]);
            const tooltipLabel = labels[hoveredIndex];
            const tooltipWidth =
              Math.max(tooltipLabel.length, String(values[hoveredIndex]).length) * CHAR_WIDTH + 24;
            const boxX = Math.min(Math.max(x - tooltipWidth / 2, 0), width - tooltipWidth);
            // Flip below the point when there is no room above it.
            const above = y - TOOLTIP_HEIGHT - 10 >= 0;
            const boxY = above ? y - TOOLTIP_HEIGHT - 10 : y + 10;
            return (
              <g pointerEvents="none">
                <circle cx={x} cy={y} r="4" fill="#c86cf0" stroke="#ffffff" strokeWidth="2" />
                <rect x={boxX} y={boxY} width={tooltipWidth} height={TOOLTIP_HEIGHT} rx="4" fill="#404040" />
                <text x={boxX + tooltipWidth / 2} y={boxY + 18} fontSize="12" fill="#ffffff" textAnchor="middle">
                  {tooltipLabel}
                </text>
                <text x={boxX + tooltipWidth / 2} y={boxY + 37} fontSize="14" fill="#ffffff" textAnchor="middle">
                  {values[hoveredIndex]}
                </text>
              </g>
            );
          })()}
        </svg>
      )}
    </div>
  );
};

export default LineChart;
