import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    planId: null,
    activityDetails: null,
    goalsById: {},
    tabs: {
        beginner: [],
        intermediate: [],
        advanced: []
    },
    activeTab: 'beginner'
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
        resetPlanState: (state,action) => {
           state.goalsById = {};
           state.tabs = { beginner: [], intermediate: [], advanced: [] }
        },
        setGoalsForTab: (state, action) => {
            const { tab, goals } = action.payload;

            // 🛡️ ensure structure exists
            if (!state.goalsById) state.goalsById = {};
            if (!state.tabs) {
                state.tabs = {
                    beginner: [],
                    intermediate: [],
                    advanced: []
                };
            }

            goals.forEach(goal => {
                state.goalsById[goal._id] = goal;
            });

            state.tabs[tab] = goals.map(g => g._id);
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        updateGoalProgress: (state, action) => {
            const { goalId, completedAt } = action.payload;

            if (state.goalsById[goalId]) {
                state.goalsById[goalId].completedAt = completedAt;
            }
        },
        clearPlan: (state) => {
            state.planId = null;
            state.activityDetails = null;
            state.goalsById = {};
            state.tabs = {
                beginner: [],
                intermediate: [],
                advanced: []
            };
            state.activeTab = "beginner";
        }
    }
});

export const { 
    setActivityDetails, 
    setGoalsForTab,
    resetPlanState, 
    updateGoalProgress, 
    setActiveTab, 
    setPlanId, 
    clearPlan 
} = planSlice.actions;
export default planSlice.reducer;