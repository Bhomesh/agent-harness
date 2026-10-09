import React from 'react';

export const IndustriesGraphic: React.FC = () => {
  const nodes: [number, number, string, string][] = [
    [260, 118, '#38bdf8', 'Fintech'],
    [366, 179, '#ec4899', 'Health'],
    [366, 301, '#c084fc', 'Retail'],
    [260, 362, '#f43f5e', 'Industry'],
    [154, 301, '#818cf8', 'Logistics'],
    [154, 179, '#f472b6', 'EdTech'],
  ];

  return (
    <svg className="site-art" viewBox="0 0 520 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="520" height="480" fill="#faf7ff" />

      {/* Orbit Rings */}
      <g transform="translate(260 240)" fill="none" stroke="#6d28d9" strokeOpacity="0.25">
        <circle r="70" />
        <circle r="122" strokeDasharray="4 8" />
        <circle r="176" />
      </g>

      {/* Connection Polygon / Chords */}
      <g stroke="#8b5cf6" strokeOpacity="0.25" strokeWidth="1.5">
        <path d="M260 118 366 301M366 179 154 301M154 179 260 362" />
        <path d="M260 118 366 179 366 301 260 362 154 301 154 179 Z" fill="none" strokeDasharray="2 4" strokeOpacity="0.4" />
      </g>

      {/* Center Core Node */}
      <circle cx="260" cy="240" r="46" fill="#0d0c2b" />
      <circle cx="260" cy="240" r="14" fill="#f43f5e" />
      <text
        x="260"
        y="244"
        fill="#ffffff"
        fontSize="10"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="'Manrope', sans-serif"
      >
        CORE
      </text>

      {/* Orbiting Planetary Nodes in Blue, Pink, Purple */}
      {nodes.map(([x, y, color, label], idx) => (
        <g key={idx}>
          <circle cx={x} cy={y} r="26" fill={color} stroke="#0d0c2b" strokeOpacity="0.2" strokeWidth="1.2" />
          <circle cx={x} cy={y} r="6" fill="#0d0c2b" fillOpacity="0.2" />
          <text
            x={x}
            y={y + 36}
            fill="#0f0c29"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
            fontFamily="'Manrope', sans-serif"
            opacity="0.85"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
};
