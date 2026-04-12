import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    streakCount: 0,
    effectivenessScore: 0,
    weeklyStats: []
}

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setProgressStats: (state,action) => {
            state.streakCount = action.payload.streakCount;
            state.effectivenessScore = action.payload.effectivenessScore;
            state.weeklyStats = action.payload.weeklyStats;
        }
    }
});

export const { setProgressStats } = progressSlice.actions;
export default progressSlice.reducer;