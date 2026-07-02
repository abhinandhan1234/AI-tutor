import React from "react";

interface RadarData {
  label: string;
  score: number; // percentage (0-100)
}

interface RadarChartProps {
  data: RadarData[];
}

export default function RadarChart({ data }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35; // 105 max radius
  const totalAxes = data.length;

  // Calculate coordinates for a given axis index, value (0 to 100), and max radius
  const getCoordinates = (index: number, value: number) => {
    const angle = (index * (2 * Math.PI)) / totalAxes - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // 1. Draw concentric background polygons (grid) at 20%, 40%, 60%, 80%, 100%
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: totalAxes })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(" ");
    return points;
  });

  // 2. Data polygon
  const dataPoints = data.map((d, i) => getCoordinates(i, d.score));
  const dataPolygonString = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // 3. Axis lines and labels
  const axes = data.map((d, i) => {
    const outerPoint = getCoordinates(i, 100);
    // Position labels slightly further out
    const labelAngle = (i * (2 * Math.PI)) / totalAxes - Math.PI / 2;
    const labelDistance = radius + 22;
    const labelX = center + labelDistance * Math.cos(labelAngle);
    const labelY = center + labelDistance * Math.sin(labelAngle);

    // Fine-tune text alignment based on angle
    let textAnchor = "middle";
    if (Math.cos(labelAngle) > 0.1) textAnchor = "start";
    else if (Math.cos(labelAngle) < -0.1) textAnchor = "end";

    // Adjust vertical alignment
    let dy = "0.35em";
    if (Math.sin(labelAngle) < -0.8) dy = "-0.1em"; // top
    else if (Math.sin(labelAngle) > 0.8) dy = "0.9em"; // bottom

    return {
      line: { x1: center, y1: center, x2: outerPoint.x, y2: outerPoint.y },
      label: { x: labelX, y: labelY, text: d.label, textAnchor, dy },
    };
  });

  return (
    <div className="w-full flex items-center justify-center py-2">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[280px] h-auto drop-shadow-sm"
      >
        {/* Concentric grid lines */}
        {gridPolygons.map((points, index) => (
          <polygon
            key={index}
            points={points}
            fill="none"
            stroke="#e7eeff"
            strokeWidth="1.5"
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, index) => (
          <line
            key={index}
            x1={axis.line.x1}
            y1={axis.line.y1}
            x2={axis.line.x2}
            y2={axis.line.y2}
            stroke="#e7eeff"
            strokeWidth="1.5"
          />
        ))}

        {/* Shaded student mastery region */}
        <polygon
          points={dataPolygonString}
          fill="rgba(37, 99, 235, 0.18)"
          stroke="#004ac6"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Data vertices points */}
        {dataPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5.5"
              fill="#ffffff"
              stroke="#004ac6"
              strokeWidth="2"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="#004ac6"
            />
          </g>
        ))}

        {/* Labels */}
        {axes.map((axis, index) => (
          <text
            key={index}
            x={axis.label.x}
            y={axis.label.y}
            textAnchor={axis.label.textAnchor}
            dy={axis.label.dy}
            className="text-[11px] font-semibold text-[#434655] tracking-tight"
          >
            {axis.label.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
