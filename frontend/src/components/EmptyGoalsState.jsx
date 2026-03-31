import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyGoalsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-lg relative">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur p-6 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-2xl blur-xl bg-cyan-500/20 pointer-events-none" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
                {/* Inline FitPulse-style logo mark */}
                <svg
                  viewBox="0 0 96 96"
                  className="w-10 h-10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M18 49.5h18l7.5-20.5L53 67l7.5-17.5H78"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center">
              No Roadmap Generated Yet
            </h2>

            <p className="mt-3 text-slate-400 text-sm text-center max-w-md">
              You haven't generated your personalized AI fitness roadmap yet.
              <br />
              Answer a few questions and let FitPulse AI build a customized plan tailored to your lifestyle and goals.
            </p>

            <button
              type="button"
              onClick={() => navigate('/roadmap')}
              className="mt-7 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Generate My AI Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

