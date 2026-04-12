const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    },
    date: {
        type: String,
        required: true
    },
    streakCount:{
        type: Number,
        default: 0
    },
    effectivenessScore: {
        type: Number,
        default: 0
    },
    progressInput: {
        rawData: { // This raw data is to be given to AI
            mealDescription: String,
            workoutDescription: String
        },
        inputMetrics: {
            sleepHours: Number,
            stepCount: Number,
            workoutDuration: Number
        }
    },
    totals: {
        caloriesConsumed: { type: Number, default: 0 },
        caloriesBurnt: { type: Number, default: 0 },
        proteinGrams: { type: Number, default: 0 },
        stepCount: { type: Number, default: 0 },
        sleepHours: { type: Number, default: 0 },
        workoutDuration: { type: Number, default: 0 }
    },
    goalStatus: {
        burnCalories: Boolean,
        consumeCalories: Boolean,
        proteinGrams: Boolean,
        stepCount: Boolean,
        sleepHours: Boolean,
        workoutDuration: Boolean
    },
    isGoalCompleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model("DailyProgress", dailyProgressSchema);