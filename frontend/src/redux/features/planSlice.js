import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    planId: null,
    activityDetails: null,
    goals: [],
}

const planSlice = createSlice({
    name: 'plan',
    initialState,
    reducers: {
        setPlanId: (state,action) => {
            state.planId = action.payload;
        },
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
        clearPlan: (state,action) => {
            state.activityDetails = null;
            state.goals = [];
        }
    }
});

export const { setActivityDetails, setGoals, updateGoalProgress, setPlanId } = planSlice.actions;
export default planSlice.reducer;