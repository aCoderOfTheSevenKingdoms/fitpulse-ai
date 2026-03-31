import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activityDetails: null,
    goals: [],
    streakCount: 0,
    caloriesBurnt: 0
}

const planSlice = createSlice({
    name: 'plan',
    initialState,
    reducers: {
        setActivityDetails: (state,action) => {
           state.activityDetails = action.payload;
        },
        setGoals: (state,action) => {
           state.goals = action.payload;
        },
        updateGoalProgress: (state,action) => {
           state.goals = state.goals.map(goal =>
                goal._id === action.payload.goalId
                ? { ...goal, completedAt: action.payload.completedAt }
                : goal
            );
        },
        updateStreakAndCalories: (state,action) => {
            state.streakCount = action.payload.streakCount;
            state.caloriesBurnt = action.payload.caloriesBurnt;
        },
        clearPlan: (state,action) => {
            state.activityDetails = null;
            state.goals = [];
        }
    }
});

export const { setActivityDetails, setGoals, updateGoalProgress, updateStreakAndCalories } = planSlice.actions;
export default planSlice.reducer;