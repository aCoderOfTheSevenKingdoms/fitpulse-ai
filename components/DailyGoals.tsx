import React, { useState, useEffect } from 'react';
import { Flame, Lock, CheckCircle, Eye, Edit2, X, Trophy } from 'lucide-react';
import { User } from '../types';

// Types
type GoalStatus = 'completed' | 'active' | 'view_only' | 'locked';

interface Goal {
  day: number;
  title: string;
  description: string;
  target: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: GoalStatus;
  calories?: number;
}

interface DailyGoalsProps {
  user?: User;
}

// Mock Data for "History" (Pre-filled for existing users)
const HISTORY_GOALS: Goal[] = [
  { day: 1, title: 'Warm-up Basics', description: 'Start with 10 mins of light jogging and dynamic stretching.', target: '15 mins', difficulty: 'Beginner', status: 'completed', calories: 120 },
  { day: 2, title: 'Core Foundation', description: '3 sets of 30s planks and 20 crunches.', target: '3 sets', difficulty: 'Beginner', status: 'completed', calories: 150 },
  { day: 3, title: 'Leg Day Starter', description: '40 squats and 20 lunges. Focus on form.', target: '60 reps total', difficulty: 'Beginner', status: 'completed', calories: 200 },
  { day: 4, title: 'Push Strength', description: '3 sets of 10 pushups (knees allowed) and tricep dips.', target: '3 sets', difficulty: 'Intermediate', status: 'active', calories: 180 },
  { day: 5, title: 'Cardio Blast', description: '20 mins of HIIT. 30s active, 30s rest.', target: '20 mins', difficulty: 'Intermediate', status: 'locked', calories: 300 },
  { day: 6, title: 'Active Recovery', description: 'Yoga flow or light swimming.', target: '30 mins', difficulty: 'Beginner', status: 'locked', calories: 100 },
  { day: 7, title: 'Full Body Challenge', description: 'Combine all previous movements into a circuit.', target: '45 mins', difficulty: 'Advanced', status: 'locked', calories: 400 },
];

// Mock Data for "New User" (Fresh start)
const FRESH_GOALS: Goal[] = [
  { day: 1, title: 'Introduction to Movement', description: 'Assess your mobility with basic stretches.', target: '10 mins', difficulty: 'Beginner', status: 'active', calories: 80 },
  { day: 2, title: 'First Steps', description: 'Light cardio walk or jog.', target: '15 mins', difficulty: 'Beginner', status: 'locked', calories: 120 },
  { day: 3, title: 'Bodyweight Basics', description: 'Squats and wall pushups.', target: '2 sets', difficulty: 'Beginner', status: 'locked', calories: 100 },
  { day: 4, title: 'Core Engagement', description: 'Plank holds and bird-dogs.', target: '10 mins', difficulty: 'Beginner', status: 'locked', calories: 90 },
  { day: 5, title: 'Recovery & Mobility', description: 'Full body foam rolling or stretching.', target: '20 mins', difficulty: 'Beginner', status: 'locked', calories: 50 },
  { day: 6, title: 'Endurance Test', description: 'Steady state cardio.', target: '25 mins', difficulty: 'Intermediate', status: 'locked', calories: 200 },
  { day: 7, title: 'Week 1 Challenge', description: 'Circuit of all learned movements.', target: '30 mins', difficulty: 'Intermediate', status: 'locked', calories: 250 },
];

export const DailyGoals: React.FC<DailyGoalsProps> = ({ user }) => {
  const [goals, setGoals] = useState<Goal[]>(HISTORY_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [progressInput, setProgressInput] = useState('');

  // Effect to reset goals if user is new (has no history)
  useEffect(() => {
    // If user explicitly has history set to false (new user), use FRESH_GOALS.
    // Otherwise (undefined or true), assume it's an existing/demo user and show history.
    if (user?.hasHistory === false) {
      setGoals(FRESH_GOALS);
    } else {
      setGoals(HISTORY_GOALS);
    }
  }, [user?.hasHistory]);

  // Handle opening modal
  const handleAction = (goal: Goal, action: 'view' | 'update') => {
    setSelectedGoal(goal);
    setIsUpdateModalOpen(action === 'update');
  };

  // Handle goal completion
  const handleSubmitProgress = () => {
    if (!selectedGoal) return;

    // Update goals state
    const updatedGoals = goals.map(g => {
      // Mark current as completed
      if (g.day === selectedGoal.day) {
        return { ...g, status: 'completed' as GoalStatus };
      }
      // Unlock next day for viewing
      if (g.day === selectedGoal.day + 1) {
        return { ...g, status: 'active' as GoalStatus }; // Change to active for user flow
      }
      return g;
    });

    setGoals(updatedGoals);
    setIsUpdateModalOpen(false);
    setSelectedGoal(null);
    setProgressInput('');
  };

  // Calculate stats based on current state
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalBurned = completedGoals.reduce((sum, g) => sum + (g.calories || 0), 0);
  const completedCount = completedGoals.length;
  // Streak is 0 if no history (fresh start), otherwise mock streak or calculated
  const streak = user?.hasHistory === false ? completedCount : 4 + completedCount;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Trophy className="w-6 h-6 text-yellow-400" />
             Daily Goals
           </h2>
           <p className="text-slate-400 mt-1">
             {user?.hasHistory === false ? 'Start your journey today!' : `Consistency is key. ${streak} Day Streak!`}
           </p>
        </div>
        
        {/* Progress Summary */}
        <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Total Burned</p>
                <p className="text-lg font-bold text-orange-400">{totalBurned} kcal</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
                <p className="text-lg font-bold text-cyan-400">{completedCount}/{goals.length}</p>
            </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div 
            key={goal.day} 
            className={`relative group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
               goal.status === 'active' 
                 ? 'bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                 : goal.status === 'completed'
                 ? 'bg-slate-900/50 border-slate-800 opacity-75 hover:opacity-100'
                 : 'bg-slate-900 border-slate-800 opacity-50'
            }`}
          >
            
            {/* Fire Icon / Status Indicator */}
            <div className={`relative w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                goal.status === 'completed'
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20'
                  : goal.status === 'active'
                  ? 'bg-slate-700' // Dull but active
                  : 'bg-slate-800' // Locked/Dull
            }`}>
                 <Flame className={`w-8 h-8 ${
                    goal.status === 'completed' ? 'text-white fill-white' : 'text-slate-500'
                 }`} />
                 <span className={`absolute -bottom-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border-4 border-slate-950 ${
                    goal.status === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'
                 }`}>
                    {goal.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : goal.day}
                 </span>
            </div>

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className={`font-bold text-lg ${goal.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                        {goal.title}
                    </h3>
                    {goal.status === 'active' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 uppercase tracking-wide border border-cyan-500/20">
                            Current
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-400 line-clamp-1">{goal.description}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-medium text-slate-500">
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">Target: {goal.target}</span>
                    <span className={`px-2 py-1 rounded bg-slate-950 border border-slate-800 ${
                        goal.difficulty === 'Advanced' ? 'text-red-400' : goal.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>{goal.difficulty}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {goal.status === 'locked' ? (
                     <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Locked</span>
                     </div>
                ) : goal.status === 'view_only' ? (
                    <button 
                        onClick={() => handleAction(goal, 'view')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                    </button>
                ) : goal.status === 'completed' ? (
                    <button 
                        onClick={() => handleAction(goal, 'view')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Details</span>
                    </button>
                ) : (
                    // Active
                    <div className="flex gap-2 w-full sm:w-auto">
                         <button 
                            onClick={() => handleAction(goal, 'view')}
                            className="flex-1 sm:flex-none flex items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                         >
                            <Eye className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => handleAction(goal, 'update')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            <Edit2 className="w-4 h-4" />
                            <span>Update</span>
                        </button>
                    </div>
                )}
            </div>

          </div>
        ))}
      </div>

      {/* Detail / Update Modal */}
      {(selectedGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                 {/* Modal Bg Effect */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500" />
                 
                 <button 
                    onClick={() => { setSelectedGoal(null); setIsUpdateModalOpen(false); }}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                 >
                    <X className="w-5 h-5" />
                 </button>

                 <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-400 mb-3 border border-slate-700">
                        Day {selectedGoal.day}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedGoal.title}</h3>
                    <p className="text-slate-400">{selectedGoal.description}</p>
                 </div>

                 <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Target</p>
                        <p className="text-lg font-mono text-cyan-400">{selectedGoal.target}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Burn</p>
                        <p className="text-lg font-mono text-orange-400">{selectedGoal.calories} kcal</p>
                    </div>
                 </div>

                 {isUpdateModalOpen ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Log Your Progress</label>
                            <textarea 
                                value={progressInput}
                                onChange={(e) => setProgressInput(e.target.value)}
                                placeholder="I completed 3 sets of..."
                                className="w-full h-24 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                            />
                        </div>
                        <button 
                            onClick={handleSubmitProgress}
                            disabled={!progressInput.trim()}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Mark as Completed
                        </button>
                    </div>
                 ) : (
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 text-center">
                        {selectedGoal.status === 'view_only' ? (
                            <p className="text-sm text-yellow-400 flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" />
                                Available to update in 24h
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400">
                                {selectedGoal.status === 'completed' ? "Great job! You've crushed this goal." : "This goal is currently locked."}
                            </p>
                        )}
                    </div>
                 )}
            </div>
        </div>
      )}
    </div>
  );
};