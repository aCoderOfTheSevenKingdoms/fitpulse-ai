import { Activity, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const RoadmapGenerationLoader = ({ isOpen, isError, onRetry }) => {
  const [dots, setDots] = useState("");

  // Animated dots loader
  useEffect(() => {
    if (!isOpen || isError) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, isError]);

  if (!isOpen) return null;

  return (
    <>
      {/* Keyframes */}
      <style>
        {`
          @keyframes pulseCollapse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(0.8);
              opacity: 0.6;
            }
          }
        `}
      </style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden">

          {/* Decorative glow elements */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 blur-3xl rounded-full"></div>

          {/* ERROR STATE */}
          {isError ? (
            <>
              <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/20">
                <AlertTriangle size={36} className="text-red-400" />
              </div>

              <h2 className="text-xl font-bold text-white mt-6">
                Roadmap Generation Failed
              </h2>

              <p className="text-slate-400 text-sm mt-2 max-w-xs">
                Something went wrong while generating your AI roadmap.
                Please try again.
              </p>

              <button
                onClick={onRetry}
                className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold mt-4 transition"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              {/* Animated Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Activity
                  size={36}
                  className="text-white"
                  style={{
                    animation: "pulseCollapse 1.6s infinite ease-in-out",
                  }}
                />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mt-6">
                Generating Your AI Roadmap
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-sm mt-2 max-w-xs">
                FitPulse AI is analyzing your lifestyle and creating a
                personalized 90-day fitness roadmap.
              </p>

              {/* Animated dots */}
              <p className="text-slate-400 text-sm mt-4">
                Preparing your plan{dots}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RoadmapGenerationLoader;