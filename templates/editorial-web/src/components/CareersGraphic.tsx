import React from 'react';

export const CareersGraphic: React.FC = () => {
  const avatars: [number, number, number, string, string][] = [
    [150, 180, 44, '#ffffff', 'DevOps Lead'],
    [330, 140, 36, '#38bdf8', 'Cloud Arch'],
    [400, 300, 40, '#0d0c2b', 'AI Engineer'],
    [260, 420, 48, '#ede9fe', 'Staff Swift'],
    [130, 330, 32, '#c084fc', 'SRE'],
  ];

  return (
    <svg className="site-art" viewBox="0 0 520 570" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="carDots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#ffffff" fillOpacity="0.2" />
        </pattern>
      </defs>

      <rect width="520" height="570" fill="#be185d" />
      <rect width="520" height="570" fill="url(#carDots)" />

      {/* Polyhedron graph wires */}
      <g stroke="#0d0c2b" strokeOpacity="0.4" strokeWidth="1.6" fill="none">
        <path d="M150 180 330 140 400 300 260 420 130 330Z" />
        <path d="M150 180 260 420M330 140 130 330M400 300 150 180" />
      </g>

      {/* Avatars */}
      {avatars.map(([x, y, r, fill, role], idx) => {
        const strokeFill = fill === '#0d0c2b' ? '#f472b6' : '#0d0c2b';
        return (
          <g key={idx}>
            <circle cx={x} cy={y} r={r} fill={fill} />
            <circle cx={x} cy={y - r * 0.22} r={r * 0.3} fill={strokeFill} fillOpacity="0.85" />
            <path
              d={`M${x - r * 0.55} ${y + r * 0.62}a${r * 0.55} ${r * 0.5} 0 0 1 ${r * 1.1} 0`}
              fill={strokeFill}
              fillOpacity="0.85"
            />
            <text
              x={x}
              y={y + r + 18}
              fill="#ffffff"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
              fontFamily="'Manrope', sans-serif"
            >
              {role}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
