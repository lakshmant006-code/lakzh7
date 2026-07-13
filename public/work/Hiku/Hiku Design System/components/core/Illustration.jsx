import React from "react";

/**
 * Illustration — flat, monochrome hiking scenes built from the Hiku green
 * palette (tonal greens only). Vector, scalable, and the-able via `tone`.
 * Scenes: "mountains" | "tent" | "forest" | "trail" | "campfire" | "lake".
 */
export function Illustration({ scene = "mountains", tone = "green", height = 160, style, ...rest }) {
  const P = TONES[tone] || TONES.green;
  const S = SCENES[scene] || SCENES.mountains;
  return (
    <svg
      viewBox="0 0 400 260"
      height={height}
      width={(height * 400) / 260}
      role="img"
      aria-label={`Hiku ${scene} illustration`}
      style={{ display: "block", maxWidth: "100%", ...style }}
      {...rest}
    >
      {S(P)}
    </svg>
  );
}

/* tonal ramps — every scene is monochrome within one hue family */
const TONES = {
  green: { bg: "#eef7f1", t1: "#b9dfc9", t2: "#8dcaaf", t3: "#4fb889", t4: "#349369", t5: "#216044", ink: "#0f3b2a" },
  deep:  { bg: "#d9ede1", t1: "#8dcaaf", t2: "#4fb889", t3: "#349369", t4: "#2b7c58", t5: "#216044", ink: "#0b2c20" },
  soft:  { bg: "#ffffff", t1: "#d9ede1", t2: "#b9dfc9", t3: "#8dcaaf", t4: "#4fb889", t5: "#349369", ink: "#216044" },
};

const SCENES = {
  mountains: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <circle cx="312" cy="66" r="30" fill={c.t2} opacity="0.6" />
      <path d="M0 210 L70 120 L120 175 L150 140 L210 210 Z" fill={c.t3} />
      <path d="M150 210 L240 96 L300 165 L340 128 L400 210 Z" fill={c.t4} />
      <path d="M240 96 L262 124 L233 138 L221 118 Z" fill={c.bg} opacity="0.85" />
      <path d="M70 120 L86 142 L60 152 L52 132 Z" fill={c.bg} opacity="0.7" />
      <rect y="208" width="400" height="52" fill={c.t5} />
      <path d="M0 224 Q120 214 200 224 T400 222 L400 260 L0 260 Z" fill={c.ink} opacity="0.5" />
    </g>
  ),
  tent: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <path d="M0 200 L110 118 L180 200 Z" fill={c.t3} opacity="0.55" />
      <path d="M230 200 L330 128 L400 200 Z" fill={c.t3} opacity="0.55" />
      <rect y="196" width="400" height="64" fill={c.t2} />
      <path d="M120 196 L200 96 L280 196 Z" fill={c.t4} />
      <path d="M200 96 L200 196 L172 196 Z" fill={c.t5} />
      <path d="M200 196 L214 158 L232 196 Z" fill={c.ink} opacity="0.55" />
      <line x1="200" y1="86" x2="200" y2="100" stroke={c.t5} strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="82" r="5" fill={c.t4} />
    </g>
  ),
  forest: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <rect y="206" width="400" height="54" fill={c.t2} />
      {[[70, 150, c.t3], [150, 120, c.t4], [235, 138, c.t3], [320, 112, c.t5]].map(([x, top, col], i) => (
        <g key={i}>
          <rect x={x - 5} y={top + 60} width="10" height="26" fill={c.t5} />
          <path d={`M${x} ${top} L${x - 34} ${top + 62} L${x + 34} ${top + 62} Z`} fill={col} />
          <path d={`M${x} ${top + 24} L${x - 40} ${top + 92} L${x + 40} ${top + 92} Z`} fill={col} />
        </g>
      ))}
      <path d="M0 232 Q200 216 400 234 L400 260 L0 260 Z" fill={c.ink} opacity="0.4" />
    </g>
  ),
  trail: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <path d="M0 150 L90 92 L160 140 L250 78 L330 120 L400 88 L400 260 L0 260 Z" fill={c.t2} />
      <path d="M0 190 L120 150 L220 196 L320 150 L400 186 L400 260 L0 260 Z" fill={c.t3} />
      <path d="M188 258 C188 210 250 200 236 150 C226 116 286 108 300 74"
        fill="none" stroke={c.t5} strokeWidth="7" strokeLinecap="round" strokeDasharray="2 16" />
      <circle cx="300" cy="70" r="9" fill={c.t4} stroke={c.bg} strokeWidth="3" />
    </g>
  ),
  campfire: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <ellipse cx="200" cy="212" rx="120" ry="26" fill={c.t2} />
      <path d="M200 96 C176 128 186 150 200 176 C222 150 236 130 214 100 C210 118 206 120 200 96 Z" fill={c.t4} />
      <path d="M200 130 C188 148 194 162 200 176 C212 162 214 150 205 132 C202 146 200 146 200 130 Z" fill={c.t5} />
      <g stroke={c.ink} strokeWidth="8" strokeLinecap="round" opacity="0.85">
        <line x1="150" y1="212" x2="250" y2="196" />
        <line x1="250" y1="212" x2="150" y2="196" />
      </g>
    </g>
  ),
  lake: (c) => (
    <g>
      <rect width="400" height="260" fill={c.bg} />
      <circle cx="86" cy="66" r="26" fill={c.t2} opacity="0.6" />
      <path d="M0 150 L110 74 L190 150 Z" fill={c.t4} />
      <path d="M150 150 L260 60 L360 150 Z" fill={c.t5} />
      <path d="M260 60 L282 92 L246 104 Z" fill={c.bg} opacity="0.8" />
      <rect y="150" width="400" height="110" fill={c.t3} />
      <g stroke={c.bg} strokeWidth="3" opacity="0.5" strokeLinecap="round">
        <line x1="60" y1="176" x2="130" y2="176" />
        <line x1="230" y1="196" x2="330" y2="196" />
        <line x1="120" y1="220" x2="260" y2="220" />
      </g>
    </g>
  ),
};

export const ILLUSTRATION_SCENES = Object.keys(SCENES);
