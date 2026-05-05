import { createSlice } from '@reduxjs/toolkit';

// Mock Data
const INITIAL_USER = {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    bio: 'Fitness enthusiast and weekend warrior. Love calisthenics and outdoor running.',
    location: 'San Francisco, CA',
    avatar: 'https://picsum.photos/200/200',
    memberSince: 'September 2023',
    isPro: true,
    weight: '74.5',
    height: '180',
    hasHistory: true // Default state for existing user
};

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    avatarUrl: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        onRoadmapGeneration: (state, action) => {
            state.user = action.payload;
        },
        onProfileUpdate: (state,action) => {
            state.user = action.payload;
        },
        setAvatar: (state,action) => {
            state.avatarUrl = action.payload;
        },
        removeAvatar: (state,action) => {
            state.avatarUrl = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { 
    setUser, 
    onRoadmapGeneration,
    onProfileUpdate, 
    setAvatar, 
    removeAvatar, 
    clearUser, 
    setLoading 
} = userSlice.actions;

export default userSlice.reducer;

