const mongoose = require('mongoose');

const goalsScehma = new mongoose.Schema({
    goalNumber: Number,
    description: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    metrics: {
        burnCalories: Number,
        consumeCalories: Number,
        sleepHours: Number,
        proteinGrams: Number,
        workoutDuration: Number,
        steps: Number 
    },
    viewableFrom: Date,
    updatableFrom: Date,
    completedAt: Date
});

module.exports = mongoose.model('Goal', goalsScehma);