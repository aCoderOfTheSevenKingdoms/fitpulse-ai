import { useState, useRef, useEffect, useCallback } from "react";

const TABS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

/**
 * GoalFilterTabs
 * A minimal, dark-themed tab switcher for the Daily Goals page.
 *
 * Props:
 *   defaultTab  – "beginner" | "intermediate" | "advanced"  (default: "beginner")
 *   onTabChange – (tab: string) => void
 */
export default function GoalFilterTabs({
  activeTab,
  onTabChange,
}) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});
  const containerRef = useRef(null);

  // Measure and reposition the sliding indicator
  const updateIndicator = useCallback(
    (tabId) => {
      const btn = tabRefs.current[tabId];
      const container = containerRef.current;
      if (!btn || !container) return;
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    },
    []
  );

  // Sync indicator on mount and on active change
  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  // Also recalculate on window resize
  useEffect(() => {
    const onResize = () => updateIndicator(activeTab);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab, updateIndicator]);

  const handleSelect = useCallback(
    (tabId) => {
      onTabChange?.(tabId);
    },
    [onTabChange]
  );

  // Keyboard: left/right arrow navigation
  const handleKeyDown = useCallback(
    (e, tabId) => {
      const currentIndex = TABS.findIndex((t) => t.id === tabId);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = TABS[(currentIndex + 1) % TABS.length];
        handleSelect(next.id);
        tabRefs.current[next.id]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = TABS[(currentIndex - 1 + TABS.length) % TABS.length];
        handleSelect(prev.id);
        tabRefs.current[prev.id]?.focus();
      }
    },
    [handleSelect]
  );

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Goal difficulty filter"
      className="
        relative flex items-center gap-1
        bg-slate-800/60 border border-slate-700/60
        rounded-2xl p-1
        w-full max-w-sm
        backdrop-blur-sm
      "
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className="
          absolute top-1 bottom-1 rounded-xl
          bg-gradient-to-br from-cyan-500/20 to-cyan-400/10
          border border-cyan-500/30
          shadow-[0_0_12px_0_rgba(6,182,212,0.15)]
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          pointer-events-none
        "
        style={indicatorStyle}
      />

      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`
              relative z-10 flex-1 px-3 py-2
              text-sm font-semibold tracking-wide
              rounded-xl whitespace-nowrap
              transition-colors duration-200
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-cyan-400/60
              focus-visible:ring-offset-1 focus-visible:ring-offset-slate-800
              ${
                isActive
                  ? "text-cyan-300"
                  : "text-slate-400 hover:text-slate-200"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}