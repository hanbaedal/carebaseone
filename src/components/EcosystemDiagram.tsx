type Props = {
  center: string;
  nodes: string[];
};

export function EcosystemDiagram({ center, nodes }: Props) {
  const radius = 168;
  const size = 440;

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7a8f62"
          strokeOpacity="0.45"
        />
        {nodes.map((label, index) => {
          const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
          const x = size / 2 + radius * Math.cos(angle);
          const y = size / 2 + radius * Math.sin(angle);
          return (
            <g key={label}>
              <line
                x1={size / 2}
                y1={size / 2}
                x2={x}
                y2={y}
                stroke="#7a8f62"
                strokeOpacity="0.35"
              />
              <circle cx={x} cy={y} r="5" fill="#1c4a3a" />
              <text
                x={x}
                y={y + (y < size / 2 ? -14 : 22)}
                textAnchor="middle"
                fill="#14221a"
                fontSize="11"
                letterSpacing="0.04em"
              >
                {label}
              </text>
            </g>
          );
        })}
        <circle cx={size / 2} cy={size / 2} r="46" fill="#1c4a3a" />
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          fill="#f4f0e6"
          fontSize="10"
          letterSpacing="0.12em"
        >
          NO
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          fill="#f4f0e6"
          fontSize="9"
        >
          {center}
        </text>
      </svg>
    </div>
  );
}
