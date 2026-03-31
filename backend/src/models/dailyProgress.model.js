const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    },
    streakCount:{
        type: Number,
        default: 0
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