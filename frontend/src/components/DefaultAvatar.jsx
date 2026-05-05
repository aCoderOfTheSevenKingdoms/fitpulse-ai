import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
//  DefaultAvatar  –  FitPulse AI
//  Shows when no profile picture is uploaded.
//  Props:
//    size   – px number, default 96
//    pulse  – boolean, enables ring-pulse animation
// ─────────────────────────────────────────────
export function DefaultAvatar({ size = 96, pulse = true }) {
  const r = size / 2;

  // Proportional geometry
  const headR   = size * 0.185;
  const headCY  = size * 0.355;
  const headCX  = r;

  // Shoulders arc — two bezier curves meeting at bottom
  const sw      = size * 0.58;   // shoulder width
  const sh      = size * 0.26;   // shoulder height
  const sx      = r - sw / 2;
  const sy      = size * 0.565;
  const cp      = size * 0.08;   // bezier control offset

  const shoulderPath = `
    M ${sx} ${sy + sh}
    Q ${sx + cp}      ${sy}        ${r - sw * 0.18} ${sy}
    Q ${r}            ${sy - cp}   ${r + sw * 0.18} ${sy}
    Q ${sx + sw - cp} ${sy}        ${sx + sw} ${sy + sh}
    Z
  `;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Default profile avatar"
      role="img"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* ── Background gradient ── */}
        <radialGradient id={`bg-${size}`} cx="50%" cy="60%" r="65%">
          <stop offset="0%"   stopColor="#1e2d45" />
          <stop offset="100%" stopColor="#0a0f1e" />
        </radialGradient>

        {/* ── Subtle cyan glow at bottom (light source from below) ── */}
        <radialGradient id={`glow-${size}`} cx="50%" cy="85%" r="55%">
          <stop offset="0%"   stopColor="#00d4d4" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00d4d4" stopOpacity="0" />
        </radialGradient>

        {/* ── Figure gradient (dark → slightly lighter) ── */}
        <linearGradient id={`fig-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a3f5f" />
          <stop offset="100%" stopColor="#1c2d48" />
        </linearGradient>

        {/* ── Cyan ring gradient ── */}
        <linearGradient id={`ring-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00d4d4" stopOpacity="0.9" />
          <stop offset="45%"  stopColor="#0891b2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00d4d4" stopOpacity="0.15" />
        </linearGradient>

        {/* ── Inner highlight rim ── */}
        <linearGradient id={`rim-${size}`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* ── Clip to circle ── */}
        <clipPath id={`circle-clip-${size}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>

        {/* ── Pulse filter (soft glow) ── */}
        <filter id={`pulse-filter-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={size * 0.025} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* ── Drop shadow for figure ── */}
        <filter id={`shadow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy={size * 0.01} stdDeviation={size * 0.03}
            floodColor="#00d4d4" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ────── Outer animated ring ────── */}
      {pulse && (
        <circle
          cx={r} cy={r} r={r - size * 0.025}
          stroke="#00d4d4"
          strokeWidth={size * 0.015}
          strokeOpacity="0.35"
          fill="none"
          style={{
            transformOrigin: "center",
            animation: "fp-pulse 2.8s ease-in-out infinite",
          }}
        />
      )}

      {/* ────── Clipped avatar body ────── */}
      <g clipPath={`url(#circle-clip-${size})`}>

        {/* Base fill */}
        <circle cx={r} cy={r} r={r} fill={`url(#bg-${size})`} />

        {/* Bottom glow wash */}
        <circle cx={r} cy={r} r={r} fill={`url(#glow-${size})`} />

        {/* ── Shoulders ── */}
        <g filter={`url(#shadow-${size})`}>
          <path d={shoulderPath} fill={`url(#fig-${size})`} />
        </g>

        {/* Shoulder cyan top-edge accent */}
        <path
          d={`
            M ${r - size * 0.105} ${size * 0.565}
            Q ${r} ${size * 0.535} ${r + size * 0.105} ${size * 0.565}
          `}
          stroke="#00d4d4"
          strokeWidth={size * 0.013}
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.7"
        />

        {/* ── Head ── */}
        <circle
          cx={headCX} cy={headCY} r={headR}
          fill={`url(#fig-${size})`}
          filter={`url(#shadow-${size})`}
        />

        {/* Head top-edge accent */}
        <circle
          cx={headCX} cy={headCY} r={headR}
          stroke="#00d4d4"
          strokeWidth={size * 0.013}
          strokeOpacity="0.65"
          fill="none"
          strokeDasharray={`${headR * 1.4} ${headR * 100}`}
          strokeDashoffset={`${-headR * 0.3}`}
          strokeLinecap="round"
          transform={`rotate(-60 ${headCX} ${headCY})`}
        />

        {/* Inner rim highlight (top-left light) */}
        <circle cx={r} cy={r} r={r - 1} fill={`url(#rim-${size})`} />

      </g>

      {/* ────── Crisp border ring ────── */}
      <circle
        cx={r} cy={r} r={r - size * 0.022}
        stroke={`url(#ring-${size})`}
        strokeWidth={size * 0.022}
        fill="none"
        filter={pulse ? `url(#pulse-filter-${size})` : undefined}
      />

      {/* ── Keyframe injection (once per page is fine) ── */}
      <style>{`
        @keyframes fp-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.04); }
        }
      `}</style>
    </svg>
  );
}


// ─────────────────────────────────────────────
//  Demo / preview page  (remove in production)
// ─────────────────────────────────────────────
// export default function App() {
//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "#0a0f1e",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: 48,
//       fontFamily: "'Segoe UI', system-ui, sans-serif",
//     }}>

//       {/* Title */}
//       <div style={{ textAlign: "center" }}>
//         <div style={{ color: "#00d4d4", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>
//           FitPulse AI
//         </div>
//         <h2 style={{ color: "#fff", margin: 0, fontWeight: 600, fontSize: 20 }}>
//           Default Avatar Component
//         </h2>
//         <p style={{ color: "#4a6080", margin: "8px 0 0", fontSize: 13 }}>
//           Shown when no profile picture is uploaded
//         </p>
//       </div>

//       {/* Size showcase */}
//       <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
//         {[40, 64, 96, 128].map(s => (
//           <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
//             <DefaultAvatar size={s} pulse={s >= 64} />
//             <span style={{ color: "#4a6080", fontSize: 11 }}>{s}px</span>
//           </div>
//         ))}
//       </div>

//       {/* Profile card mock */}
//       <div style={{
//         background: "linear-gradient(135deg, #141a2e 0%, #0f1525 100%)",
//         border: "1px solid #1e2d45",
//         borderRadius: 16,
//         padding: "28px 32px",
//         display: "flex",
//         alignItems: "center",
//         gap: 20,
//         width: 360,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
//       }}>
//         <DefaultAvatar size={72} />
//         <div>
//           <div style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
//             Anunay Sharma
//             <span style={{
//               marginLeft: 8,
//               background: "#d97706",
//               color: "#fff",
//               fontSize: 9,
//               fontWeight: 700,
//               letterSpacing: 1,
//               padding: "2px 6px",
//               borderRadius: 4,
//               verticalAlign: "middle",
//             }}>PRO</span>
//           </div>
//           <div style={{ color: "#4a6080", fontSize: 12 }}>New Delhi, India</div>
//           <div style={{ color: "#00d4d4", fontSize: 11, marginTop: 6, opacity: 0.8 }}>
//             Member since September 2023
//           </div>
//         </div>
//       </div>

//       {/* Usage note */}
//       <div style={{
//         background: "#0f1525",
//         border: "1px solid #1e2d45",
//         borderRadius: 10,
//         padding: "14px 20px",
//         maxWidth: 380,
//         color: "#4a6080",
//         fontSize: 12,
//         lineHeight: 1.7,
//       }}>
//         <span style={{ color: "#00d4d4" }}>Usage: </span>
//         {'<DefaultAvatar size={96} pulse={true} />'}
//         <br />
//         Props: <span style={{ color: "#e2e8f0" }}>size</span> (number, default 96) ·{" "}
//         <span style={{ color: "#e2e8f0" }}>pulse</span> (boolean, default true)
//       </div>
//     </div>
//   );
// }
