import React from 'react';

export const AboutGraphic: React.FC = () => {
  const steps = [
    { label: 'Architect', detail: 'Cloud-Native & Distributed' },
    { label: 'Build Swiftly', detail: 'Zero-Latency Engineering Pods' },
    { label: 'Test & Ship', detail: 'Automated CI/CD & Security Gates' },
    { label: 'Observe & Scale', detail: 'Telemetry & Continuous Reliability' },
  ];

  return (
    <svg className="site-art" viewBox="0 0 520 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="aboutDots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#a855f7" fillOpacity="0.22" />
        </pattern>
        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      <rect width="520" height="620" fill="#0d0c2b" />
      <rect width="520" height="620" fill="url(#aboutDots)" />

      {/* Ambient background glows */}
      <circle cx="430" cy="120" r="160" fill="#38bdf8" fillOpacity="0.12" />
      <circle cx="90" cy="530" r="180" fill="#ec4899" fillOpacity="0.12" />

      {/* Pipeline stages */}
      {steps.map((item, idx) => (
        <g key={item.label} transform={`translate(70 ${90 + idx * 118})`}>
          {/* Card container */}
          <rect
            width="380"
            height="86"
            rx="14"
            fill="#ffffff"
            fillOpacity="0.06"
            stroke="#8b5cf6"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />

          {/* Indicator node with electric pink glow */}
          <circle
            cx="44"
            cy="43"
            r="18"
            fill="#f43f5e"
            fillOpacity="0.22"
            stroke="#f43f5e"
            strokeWidth="1.5"
          />
          <circle cx="44" cy="43" r="6" fill="#f43f5e" />

          {/* Header Text */}
          <text
            x="80"
            y="38"
            fill="#ffffff"
            fontSize="19"
            fontWeight="800"
            fontFamily="'Manrope', sans-serif"
            letterSpacing="-0.3"
          >
            {item.label}
          </text>

          {/* Detail Subtitle */}
          <text
            x="80"
            y="56"
            fill="#c7d2fe"
            fontSize="11"
            fontWeight="600"
            fontFamily="'Manrope', sans-serif"
            opacity="0.9"
            letterSpacing="0.2"
          >
            {item.detail}
          </text>

          {/* Progress bar accent with blue-purple-pink gradient */}
          <rect
            x="80"
            y="65"
            width={210 - idx * 30}
            height="5"
            rx="2.5"
            fill="url(#barGrad)"
            fillOpacity="0.8"
          />

          {/* Connector dashed line to next step */}
          {idx < steps.length - 1 && (
            <path
              d="M44 86v32"
              stroke="#ec4899"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          )}
        </g>
      ))}
    </svg>
  );
};
