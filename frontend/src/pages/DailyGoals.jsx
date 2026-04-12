import React, { useState, useMemo, useEffect } from 'react';
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
import { EmptyGoalsState } from '../components/EmptyGoalsState';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {setGoals, updateGoalProgress} from '../redux/features/planSlice';
import { setProgressStats } from '../redux/features/progressSlice';
import RoadmapGenerationLoader from '../components/RoadmapGenerationLoader';
import { useLocation } from 'react-router-dom';

// Mock Data for "History" (Pre-filled for existing users)
const HISTORY_GOALS = [
    { day: 1, title: 'Warm-up Basics', description: 'Start with 10 mins of light jogging and dynamic stretching.', target: '15 mins', difficulty: 'Beginner', status: 'completed', calories: 120 },
    { day: 2, title: 'Core Foundation', description: '3 sets of 30s planks and 20 crunches.', target: '3 sets', difficulty: 'Beginner', status: 'completed', calories: 150 },
    { day: 3, title: 'Leg Day Starter', description: '40 squats and 20 lunges. Focus on form.', target: '60 reps total', difficulty: 'Beginner', status: 'completed', calories: 200 },
    { day: 4, title: 'Push Strength', description: '3 sets of 10 pushups (knees allowed) and tricep dips.', target: '3 sets', difficulty: 'Intermediate', status: 'active', calories: 180 },
    { day: 5, title: 'Cardio Blast', description: '20 mins of HIIT. 30s active, 30s rest.', target: '20 mins', difficulty: 'Intermediate', status: 'locked', calories: 300 },
    { day: 6, title: 'Active Recovery', description: 'Yoga flow or light swimming.', target: '30 mins', difficulty: 'Beginner', status: 'locked', calories: 100 },
    { day: 7, title: 'Full Body Challenge', description: 'Combine all previous movements into a circuit.', target: '45 mins', difficulty: 'Advanced', status: 'locked', calories: 400 },
];

// Mock Data for "New User" (Fresh start)
const FRESH_GOALS = [
    { day: 1, title: 'Introduction to Movement', description: 'Assess your mobility with basic stretches.', target: '10 mins', difficulty: 'Beginner', status: 'active', calories: 80 },
    { day: 2, title: 'First Steps', description: 'Light cardio walk or jog.', target: '15 mins', difficulty: 'Beginner', status: 'locked', calories: 120 },
    { day: 3, title: 'Bodyweight Basics', description: 'Squats and wall pushups.', target: '2 sets', difficulty: 'Beginner', status: 'locked', calories: 100 },
    { day: 4, title: 'Core Engagement', description: 'Plank holds and bird-dogs.', target: '10 mins', difficulty: 'Beginner', status: 'locked', calories: 90 },
    { day: 5, title: 'Recovery & Mobility', description: 'Full body foam rolling or stretching.', target: '20 mins', difficulty: 'Beginner', status: 'locked', calories: 50 },
    { day: 6, title: 'Endurance Test', description: 'Steady state cardio.', target: '25 mins', difficulty: 'Intermediate', status: 'locked', calories: 200 },
    { day: 7, title: 'Week 1 Challenge', description: 'Circuit of all learned movements.', target: '30 mins', difficulty: 'Intermediate', status: 'locked', calories: 250 },
];


// ----------------------
// Helpers
// ----------------------

const getDifficulty = (day) => {
    if (day <= 30) return 'Beginner';
    if (day <= 60) return 'Intermediate';
    return 'Advanced';
};

const getGoalStatus = (goal) => {
  const now = Date.now();

  const viewableFrom = new Date(goal.viewableFrom).getTime();
  const completedAt = goal.completedAt
      ? new Date(goal.completedAt).getTime()
      : null;

  if (completedAt && now > completedAt) return 'completed';

  if (now < viewableFrom) return 'locked';

  if (now >= viewableFrom && now < viewableFrom + 24 * 60 * 60 * 1000) {
      return 'active';
  }

  return 'unlocked';
};

// ----------------------
// Component
// ----------------------

export const DailyGoals = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    // From redux slices
    const { user } = useSelector((state) => state.user);
    const { goals: planGoals, planId } = useSelector((state) => state.plan);
    const { streakCount, weeklyStats } = useSelector((state) => state.progress);

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isPlanGenerationPending, setIsPlanGenerationPending] = useState(false);
    const [error,setError] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [progressInput, setProgressInput] = useState({ 
      mealDescription: "",
      workoutDescription: "",
      sleepHours: 0,
      stepCount: 0,
      workoutDuration: 0
    });

    // Poll every 2 seconds to getPlan api to get goals
    useEffect(() => {
      let isMounted = true;
      if(location.state?.isNewPlan){
        setIsPlanGenerationPending(true);
      }

      const interval = setInterval(async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/plan/get-plan/${planId}`,
            { withCredentials: true }
          );

          if (!isMounted) return;

          if (res.data.status === "completed") {
            dispatch(setGoals(res.data.goals));
            setIsPlanGenerationPending(false);
            clearInterval(interval);
          } 
          else if (res.data.status === "failed") {
            setError(true);
            clearInterval(interval);
          } 

        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }, [planId]);

    // ----------------------
    // Goals Source (AI or fallback)
    // ----------------------

    const rawGoals = useMemo(() => {
        if (planGoals?.length) return planGoals;
        return [];
    }, [planGoals]);

    // ----------------------
    // Normalized Goals
    // ----------------------

    const goals = useMemo(() => {
        return rawGoals.map((goal) => ({
            id: goal._id,
            day: goal.goalNumber,
            description: goal.description,
            targets: goal.metrics || {},

            status: getGoalStatus(goal),
            difficulty: getDifficulty(goal.goalNumber),

            viewableFrom: goal.viewableFrom,
            updatableFrom: goal.updatableFrom
        }));
    }, [rawGoals]);

    // ----------------------
    // Stats
    // ----------------------

    const completedCount = useMemo(() => {
      return goals.filter(goal => goal.status === 'completed').length;
    }, [goals]);

    const avgCaloriesBurnt = useMemo(() => {
 
      if (!Array.isArray(weeklyStats) || weeklyStats.length === 0) {
        return 0;
      }

      let avg = 0;
      let total = 0;

      weeklyStats.forEach((statObj) => {
        total += statObj.caloriesBurnt;
      })

      avg = total/7;
 
      return avg;
    }, [weeklyStats]);

    const streak = useMemo(() => {
        if (!user?.hasHistory) return 0;
        return streakCount;
    }, [user, streakCount]);

    // ----------------------
    // Handlers
    // ----------------------

    const handleProgressInputChange = (field, value) => {
      setProgressInput(prev => ({ ...prev, [field]: value }));
    }

    const handleAction = (goal, action) => {
      setSelectedGoal(goal);
      setIsUpdateModalOpen(action === 'update');
    };

    const handleCloseModal = () => {
        setSelectedGoal(null);
        setIsUpdateModalOpen(false);
        setProgressInput({
          mealDescription: "",
          workoutDescription: "",
          sleepHours: 0,
          stepCount: 0,
          workoutDuration: 0
        });
    };

    const handleSubmitProgress = async () => {
        if (!selectedGoal || !progressInput.mealDescription.trim() || !progressInput.workoutDescription.trim()) return;

        setIsLoading(true);

        try {
            // ----------------------
            // 🔌 BACKEND API PLACEHOLDER
            // ----------------------
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/progress/log`, 
                {
                  goalId: selectedGoal.id,
                  mealDescription: progressInput.mealDescription || "",
                  workoutDescription: progressInput.workoutDescription || "",
                  sleepHours: Number(progressInput.sleepHours) || 0,
                  stepCount: Number(progressInput.stepCount) || 0,
                  workoutDuration: Number(progressInput.workoutDuration) || 0
                }, 
                { withCredentials: true }
            )     
 
            console.log("API response: ", response.data);

            // ----------------------
            // 🔁 REDUX UPDATE PLACEHOLDER
            // ----------------------
            dispatch(updateGoalProgress({
              goalId: selectedGoal.id,
              completedAt: response.data.completedAt
            }));

            dispatch(setProgressStats({
              streakCount: response.data.streakCount,
              effectivenessScore: response.data.effectivenessScore,
              weeklyStats: response.data.weeklyStats || []
            }))

        } catch (err) {
            setIsLoading(false);
            console.error('Failed to update progress', err);
        } finally {
            setIsLoading(false);
            handleCloseModal();
        }
    };

    if(isPlanGenerationPending || error){
      return (<RoadmapGenerationLoader
        isOpen={true}
        isError={error}
      />)
    }

    if (!goals.length) return <EmptyGoalsState />;

    // ----------------------
    // UI
    // ----------------------

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Daily Goals
              </h2>
              <p className="text-slate-400 mt-1">
                {user?.hasHistory === false
                  ? "Start your journey today!"
                  : `Consistency is key. ${streak} Day Streak!`}
              </p>
            </div>
      
            {/* Progress Summary */}
            <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Avg Calories Burnt
                </p>
                <p className="text-lg font-bold text-orange-400">
                  {avgCaloriesBurnt} cal
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Completed
                </p>
                <p className="text-lg font-bold text-cyan-400">
                  {completedCount}/{goals.length}
                </p>
              </div>
            </div>
          </div>
      
          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.day}
                className={`relative group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
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
            ))}
          </div>
      
          {/* Detail / Update Modal */}
          {selectedGoal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500" />
      
                <button
                  onClick={() => {
                    setSelectedGoal(null);
                    setIsUpdateModalOpen(false);
                  }}
                  className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
      
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-400 mb-3 border border-slate-700">
                    Day {selectedGoal.day}
                  </span>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">
                    {selectedGoal.description}
                  </h3>
                </div>
      
                {!isUpdateModalOpen && (<div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      METRICS
                    </p>
                    {Object.keys(selectedGoal.targets).map((key) => {
                      return <p key={key} className="text-lg font-mono text-cyan-400">{key}</p>;
                    })}
                  </div>
      
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      TARGETS
                    </p>
                    {Object.values(selectedGoal.targets).map((value) => {
                      return <p key={value} className="text-lg font-mono text-orange-400">{value}</p>;
                    })}
                  </div>
                </div>)}
      
                {isUpdateModalOpen && (
                  <div className="space-y-4">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/** Enter Steps Count */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Steps Count</label>
                                <input
                                    type="number"
                                    value={progressInput.stepCount}
                                    onChange={(e) => handleProgressInputChange('stepCount', e.target.value)}
                                    placeholder=""
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                        </div>

                        {/** Enter sleep hours */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Sleep Hours</label>
                                <input
                                    type="number"
                                    value={progressInput.sleepHours}
                                    onChange={(e) => handleProgressInputChange('sleepHours', e.target.value)}
                                    placeholder="Hours"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                        </div>

                        {/** Enter workout duration */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Workout Duration</label>
                                <input
                                    type="number"
                                    value={progressInput.workoutDuration}
                                    onChange={(e) => handleProgressInputChange('workoutDuration', e.target.value)}
                                    placeholder="Hours"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                                />
                        </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Meal Description
                      </label>
                      <textarea
                        value={progressInput.mealDescription}
                        onChange={(e) => handleProgressInputChange('mealDescription', e.target.value)}
                        placeholder="eg. I ate fish & 2 boiled eggs..."
                        className="w-full h-24 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                      />
                    </div>
      
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Workout Description
                      </label>
                      <textarea
                        value={progressInput.workoutDescription}
                        onChange={(e) => handleProgressInputChange('workoutDescription', e.target.value)}
                        placeholder="eg. I completed 3 sets of..."
                        className="w-full h-24 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmitProgress}
                      disabled={!progressInput.mealDescription.trim() || !progressInput.workoutDescription.trim() || isLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {
                        isLoading ? (
                          <Activity className="w-4 h-4 animate-spin" />
                        ) : <span>Mark As Completed</span>
                      }
                    </button>
      
                    {selectedGoal.status === "completed" && (
                      <p className="text-sm text-slate-400">
                        Great job! You've crushed this goal.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}  
        </div>
    );
}   