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
import {
  setGoalsForTab,
  resetPlanState, 
  setPlanId, 
  setActiveTab, 
  updateGoalProgress
} from '../redux/features/planSlice';
import { setProgressStats } from '../redux/features/progressSlice';
import RoadmapGenerationLoader from '../components/RoadmapGenerationLoader';
import { useLocation } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import { GoalsList } from '../components/GoalsList';
import GoalFilterTabs from '../components/GoalFilterTabs';
import logger from '../utils/logger';

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
    const planState = useSelector((state) => state.plan);

    const planId = planState?.planId;
    const goalsById = planState?.goalsById || {};
    const tabs = planState?.tabs || {
      beginner: [],
      intermediate: [],
      advanced: []
    };
    const activeTab = planState?.activeTab || "beginner";
    const { streakCount, weeklyStats } = useSelector((state) => state.progress);

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isPlanGenerationPending, setIsPlanGenerationPending] = useState(false);
    const [error,setError] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isTabSwitching, setIsTabSwitching] = useState(false);
    const [progressInput, setProgressInput] = useState({ 
      mealDescription: "",
      workoutDescription: "",
      sleepHours: 0,
      stepCount: 0,
      workoutDuration: 0
    });

    const tabRanges = {
      beginner: { start: 0, limit: 30 },
      intermediate: { start: 30, limit: 30 },
      advanced: { start: 60, limit: 30 }
    };

    const fetchGoalsByTab = async (tab) => {
      try{

        if(tabs[tab]?.length > 0) return;
        
        setIsTabSwitching(true);

        const {start, limit} = tabRanges[tab];

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/plan/get-plan/${planId}?start=${start}&limit=${limit}`,
          {withCredentials: true}
        );

        logger.log("TAB: ", tab);
        logger.log("API response: ", res.data.goals);

        dispatch(setGoalsForTab({
          tab,
          goals: res.data.goals
        }));

      } catch (error) {
        logger.error(error.message);
        showError("Some errr occured while fetching goals");
      } finally {
        setIsTabSwitching(false);
      }
    }

    const handleTabChange = (tab) => {
      dispatch(setActiveTab(tab));
      fetchGoalsByTab(tab);
    }

    // Poll every 2 seconds to getPlan api to get goals
    useEffect(() => {

    if(!location.state?.isNewPlan) return;

    let isMounted = true;
    setIsPlanGenerationPending(true);
    let delay = 2000;

    const poll = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/plan/get-plan/${planId}`,
          { withCredentials: true }
        );

        if (!isMounted) return;

        if (res.data.status === "completed") {
          setIsPlanGenerationPending(false);

          dispatch(resetPlanState());
          // 👇 Fetch first tab data after completion
          fetchGoalsByTab("beginner");

          showSuccess("Plan Generated Successfully");
          return;
        }

        if (res.data.status === "failed") {
          setError(true);
          return;
        }

        delay = Math.min(delay * 1.5, 10000);
        setTimeout(poll, delay);

      } catch (err) {
        logger.error(`[POLLING ERROR] ${err.message}`);
      }
    };

    poll();

    return () => {
      isMounted = false;
    };

  }, [planId]);

    // ----------------------
    // Goals Source (AI or fallback)
    // ----------------------

    const rawGoals = useMemo(() => {
      const ids = tabs?.[activeTab] || [];
      return ids.map(id => goalsById[id]).filter(Boolean);
    }, [tabs, goalsById, activeTab]);

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
 
      return Math.round(avg);
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

            showSuccess("Progress logged successfully");

        } catch (err) {
            setIsLoading(false);
            logger.error(`[PROGRESS UPDATE ERROR] ${err.message}`);
            showError(err.message || "Failed to log progress");
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
        <div className="relative w-full max-w-4xl mx-auto animate-in fade-in duration-500">
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
            <div className="min-w-fit flex justify-center items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Avg Calories Burnt
                </p>
                <p className="text-lg font-bold text-orange-400">
                  {avgCaloriesBurnt} cal
                </p>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-center">
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
          <div
            className='sticky top-20 z-10 mb-8 flex justify-center'
          >
            <GoalFilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          
          {isTabSwitching ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-slate-800 border border-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <GoalsList goals={goals} handleAction={handleAction} />
          )}
      
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
                      className="w-full py-3.5 flex justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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