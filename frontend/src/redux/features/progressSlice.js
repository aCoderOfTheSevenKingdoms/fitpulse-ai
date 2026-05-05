import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    streakCount: 0,
    effectivenessScore: 0,
    weeklyStats: [],
    progressPics: []
}

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setProgressStats: (state,action) => {
            state.streakCount = action.payload.streakCount;
            state.effectivenessScore = action.payload.effectivenessScore;
            state.weeklyStats = action.payload.weeklyStats;
        },
        setProgressPics: (state,action) => {
            state.progressPics = action.payload;
        },
        deletePic: (state,action) => {
            state.progressPics = state.progressPics.filter((pic) => pic.id !== action.payload);
        }
    }
});

export const { setProgressStats, setProgressPics, deletePic } = progressSlice.actions;
export default progressSlice.reducer;