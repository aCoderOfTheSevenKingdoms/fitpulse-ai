import { 
    Activity,
    Flame, 
    Lock, 
    CheckCircle, 
    Eye, 
    Edit2, 
    X, 
    Trophy 
} from 'lucide-react';

export const GoalCard = ({ goal, handleAction }) => {
    return (
              <div
                key={goal.day}
                className={`relative group flex flex-col min-h-fit sm:flex-row items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  goal.status === "active"
                    ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                {/* Fire Icon / Status Indicator */}
                <div
                  className={`relative w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                    goal.status === "completed"
                      ? "bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20"
                      : goal.status === "active"
                      ? "bg-slate-700"
                      : "bg-slate-800"
                  }`}
                >
                  <Flame
                    className={`w-8 h-8 ${
                      goal.status === "completed"
                        ? "text-white fill-white"
                        : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border-4 border-slate-950 ${
                      goal.status === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {goal.status === "completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      goal.day
                    )}
                  </span>
                </div>
      
                {/* Content */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3
                      className={`font-bold text-lg ${
                        goal.status === "locked" ? "text-slate-500" : "text-white"
                      }`}
                    >
                      {goal.description}
                    </h3>
      
                    {goal.status === "active" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 uppercase tracking-wide border border-cyan-500/20">
                        Current
                      </span>
                    )}
                  </div>
      
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-medium text-slate-500">
                    <span
                      className={`px-2 py-1 rounded bg-slate-950 border border-slate-800 ${
                        goal.difficulty === "Advanced"
                          ? "text-red-400"
                          : goal.difficulty === "Intermediate"
                          ? "text-yellow-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {goal.difficulty}
                    </span>
                  </div>
                </div>
      
                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {goal.status === "locked" ? (
                    <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Locked</span>
                    </div>
                  ) : goal.status === "completed" ? (
                    <button
                      onClick={() => handleAction(goal, "view")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Details</span>
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(goal, "view")}
                        className="flex-1 sm:flex-none flex items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(goal, "update")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Update</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
}