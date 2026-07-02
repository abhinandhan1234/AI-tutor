import React from "react";

interface LineChartProps {
  data: { day: string; hours: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  const width = 500;
  const height = 150;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for scaling (or default to 1.5 hours)
  const maxHours = Math.max(...data.map((d) => d.hours), 1.5);

  // Calculate coordinates for each data point
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.hours / maxHours) * chartHeight;
    return { x, y, day: d.day, value: d.hours };
  });

  // Create a smooth cubic-bezier curve from points (Catmull-Rom or cubic bezier approximation)
  let pathString = "";
  if (points.length > 0) {
    pathString = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      // Control points for a smooth curve
      const cpX1 = curr.x + chartWidth / (data.length - 1) / 3;
      const cpY1 = curr.y;
      const cpX2 = next.x - chartWidth / (data.length - 1) / 3;
      const cpY2 = next.y;
      pathString += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
  }

  // Path string for the shaded area below the curve
  let areaPathString = "";
  if (points.length > 0) {
    areaPathString = `${pathString} L ${points[points.length - 1].x} ${
      paddingTop + chartHeight
    } L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Shaded gradient under curve */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006c49" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#006c49" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal subtle grid lines */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={width - paddingRight}
          y2={paddingTop}
          stroke="#f0f3ff"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop + chartHeight / 2}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight / 2}
          stroke="#f0f3ff"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop + chartHeight}
          x2={width - paddingRight}
          y2={paddingTop + chartHeight}
          stroke="#e7eeff"
          strokeWidth="1.5"
        />

        {/* Gradient Area Fill */}
        {areaPathString && (
          <path
            d={areaPathString}
            fill="url(#chartGradient)"
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Smooth Curved Line */}
        {pathString && (
          <path
            d={pathString}
            fill="none"
            stroke="#006c49"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Interactive Dots */}
        {points.map((point, index) => (
          <g key={index} className="group cursor-pointer">
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#006c49"
              fillOpacity="0"
              className="hover:fill-opacity-10 transition-all duration-150"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill="#ffffff"
              stroke="#006c49"
              strokeWidth="2.5"
              className="transition-all duration-150 group-hover:scale-125"
            />
            {/* Tooltip value on hover */}
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="text-[10px] font-bold text-[#006c49] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
            >
              {point.value}h
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 2}
            textAnchor="middle"
            className="text-[11px] font-semibold text-[#737686] tracking-tight"
          >
            {point.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

