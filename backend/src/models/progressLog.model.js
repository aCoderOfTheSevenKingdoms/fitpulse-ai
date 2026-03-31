const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true
    },
    date: {
        type: String, // "2026-03-22"
        required: true,
        index: true
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
    }
}, { timestamps: true });

module.exports = mongoose.model("ProgressLog", progressLogSchema);