export default function SkillPipeline() {
  const nodes = [
    { x: 20, y: 30, w: 100, h: 36, label: "SQL / APIs" },
    { x: 20, y: 80, w: 100, h: 36, label: "Excel / CSV" },
    { x: 160, y: 55, w: 110, h: 36, label: "Python / EDA" },
    { x: 310, y: 55, w: 120, h: 36, label: "ETL & Analysis" },
    { x: 460, y: 30, w: 120, h: 36, label: "Postgres/MySQL" },
    { x: 460, y: 80, w: 120, h: 36, label: "Relational DB" },
    { x: 310, y: 130, w: 120, h: 36, label: "Power BI" },
    { x: 160, y: 130, w: 110, h: 36, label: "Visualization" },
    { x: 20, y: 180, w: 100, h: 36, label: "Data Sources" },
    { x: 460, y: 180, w: 120, h: 36, label: "Golang/Laravel" },
    { x: 310, y: 200, w: 120, h: 36, label: "RESTful APIs" },
  ];

  return (
    <svg
      viewBox="0 0 600 250"
      className="skill-pipeline-svg w-full"
      aria-label="Skill pipeline flowchart"
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#C85C40" opacity="0.5" />
        </marker>
      </defs>

      {[
        "M 120 48 L 160 73",
        "M 120 98 L 160 73",
        "M 270 73 L 310 73",
        "M 430 73 L 460 48",
        "M 430 73 L 460 98",
        "M 370 91 L 370 130",
        "M 215 91 L 215 130",
        "M 120 198 L 160 148",
        "M 520 198 L 430 218",
        "M 370 166 L 370 200",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="#E0DAD0"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrow)"
        />
      ))}

      {nodes.map((n) => (
        <g key={n.label} className="svg-node">
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="6"
            fill="#FFFFFF"
            stroke="#E0DAD0"
            strokeWidth="1.5"
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2 + 4}
            textAnchor="middle"
            fontFamily="Space Mono, monospace"
            fontSize="9"
            fill="#665E55"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
