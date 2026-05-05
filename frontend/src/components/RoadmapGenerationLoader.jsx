import { AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const LOADING_MESSAGES = [
  { text: "Analyzing your fitness profile…", sub: "Reading your goals & lifestyle data" },
  { text: "It'll take just a moment", sub: "Crunching 90 days of smart planning" },
  { text: "Tweaking every detail for you", sub: "Making it as personalized as possible" },
  { text: "Calibrating intensity levels…", sub: "Balancing challenge with recovery" },
  { text: "Almost there, hang tight!", sub: "Final touches on your roadmap" },
];

// Heartbeat SVG path — ECG-style waveform
const HeartbeatPath = ({ color = "#22d3ee", animate = true }) => {
  const pathRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(320);

  useEffect(() => {
    if (!animate) return;
    let raf;
    let start = null;
    const duration = 1800;
    const total = 320;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      const progress = elapsed / duration;
      // Draw then erase loop
      const offset = total - progress * total * 2;
      setDashOffset(Math.max(0, offset));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <svg
      viewBox="0 0 320 60"
      width="100%"
      height="60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Base dim track */}
      <path
        d="M0 30 L55 30 L65 30 L72 10 L82 52 L92 14 L100 48 L108 30 L160 30 L215 30 L225 30 L232 10 L242 52 L252 14 L260 48 L268 30 L320 30"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated line */}
      <path
        ref={pathRef}
        d="M0 30 L55 30 L65 30 L72 10 L82 52 L92 14 L100 48 L108 30 L160 30 L215 30 L225 30 L232 10 L242 52 L252 14 L260 48 L268 30 L320 30"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="320"
        strokeDashoffset={dashOffset}
        filter="url(#glow)"
      />
    </svg>
  );
};

// Pulsing rings around a central icon
const PulseRings = ({ isError }) => {
  return (
    <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
      <style>{`
        @keyframes ringPulse {
          0% { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes ringPulse2 {
          0% { transform: scale(0.7); opacity: 0.4; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.12); }
          28% { transform: scale(1); }
          42% { transform: scale(1.08); }
          56% { transform: scale(1); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes msgFade {
          0% { opacity: 0; transform: translateY(8px); }
          15% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes barGrow {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* Pulse rings */}
      {!isError && (
        <>
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(34,211,238,0.5)",
            animation: "ringPulse 2s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(99,179,237,0.3)",
            animation: "ringPulse2 2s ease-out infinite 0.5s",
          }} />
        </>
      )}

      {/* Center icon */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        background: isError
          ? "linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)"
          : "linear-gradient(135deg, #0e7490 0%, #1d4ed8 100%)",
        border: isError ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid rgba(34,211,238,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: isError ? "errorShake 0.5s ease-in-out" : "heartbeat 1.6s ease-in-out infinite",
      }}>
        {isError ? (
          <AlertTriangle size={32} color="#f87171" />
        ) : (
          <HeartSVGIcon />
        )}
      </div>
    </div>
  );
};

const HeartSVGIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 8.5C3 6 5 4 7.5 4C9 4 10.3 4.7 11.2 5.8L12 6.7L12.8 5.8C13.7 4.7 15 4 16.5 4C19 4 21 6 21 8.5C21 11.5 18.5 14 12 19C5.5 14 3 11.5 3 8.5Z"
      fill="rgba(255,255,255,0.9)"
    />
    {/* ECG line through heart */}
    <path
      d="M6 12 L8.5 12 L9.5 9.5 L10.5 14 L11.5 10.5 L12.5 12 L15.5 12 L16 12"
      stroke="rgba(14,116,144,0.9)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Animated bar equalizer
const Equalizer = ({ active }) => {
  const bars = [0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9, 0.65, 0.75, 0.45];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 28 * h,
            borderRadius: 2,
            background: active
              ? `linear-gradient(to top, #0891b2, #67e8f9)`
              : "rgba(100,116,139,0.3)",
            transformOrigin: "bottom",
            animation: active ? `barGrow ${0.6 + i * 0.07}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
};

// Rotating message component
const RotatingMessage = ({ messages }) => {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
      setKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages]);

  const msg = messages[index];
  return (
    <div style={{ textAlign: "center", minHeight: 52 }}>
      <p
        key={`main-${key}`}
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#f1f5f9",
          margin: 0,
          animation: "msgFade 3s ease forwards",
          letterSpacing: "-0.01em",
        }}
      >
        {msg.text}
      </p>
      <p
        key={`sub-${key}`}
        style={{
          fontSize: 12,
          color: "#64748b",
          margin: "4px 0 0",
          animation: "msgFade 3s ease forwards",
          animationDelay: "0.1s",
          opacity: 0,
        }}
      >
        {msg.sub}
      </p>
    </div>
  );
};

// Step indicators
const StepDots = ({ total = 5 }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === active
              ? "linear-gradient(90deg, #22d3ee, #3b82f6)"
              : i < active
                ? "rgba(34,211,238,0.4)"
                : "rgba(100,116,139,0.25)",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      ))}
    </div>
  );
};

const RoadmapGenerationLoader = ({ isOpen, isError }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(160deg, #0f172a 0%, #0c1a2e 60%, #0f172a 100%)",
        borderRadius: 20,
        border: "1px solid rgba(34,211,238,0.12)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Background grid pattern */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: -60, left: "10%",
        width: 200, height: 200,
        background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, right: "5%",
        width: 180, height: 180,
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top row: icon + ecg + status */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}>
        <PulseRings isError={isError} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {isError ? (
            <>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fca5a5", margin: "0 0 4px" }}>
                Generation Failed
              </p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Something went wrong. Please try again.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#22d3ee", margin: "0 0 6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                FitPulse AI
              </p>
              <HeartbeatPath color="#22d3ee" animate />
            </>
          )}
        </div>

        {!isError && (
          <div style={{ flexShrink: 0 }}>
            <Equalizer active={!isError} />
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{
        width: "100%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.15), rgba(59,130,246,0.15), transparent)",
        position: "relative",
        zIndex: 1,
      }} />

      {/* Message area */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {isError ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              Your AI roadmap couldn't be generated. Check your connection and try again.
            </p>
          </div>
        ) : (
          <RotatingMessage messages={LOADING_MESSAGES} />
        )}
      </div>

      {/* Step dots */}
      {!isError && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
          <StepDots total={5} />
          <p style={{ fontSize: 11, color: "#334155", margin: 0, letterSpacing: "0.05em" }}>
            BUILDING YOUR 90-DAY PLAN
          </p>
        </div>
      )}

      {/* Bottom stat chips */}
      {!isError && (
        <div style={{
          display: "flex",
          gap: 10,
          zIndex: 1,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {[
            { label: "Workouts", value: "90 days" },
            { label: "Goals", value: "Personalized" },
            { label: "Recovery", value: "Smart rest" },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(34,211,238,0.1)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: "#475569", letterSpacing: "0.05em" }}>
                {chip.label.toUpperCase()}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
                {chip.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerationLoader;
