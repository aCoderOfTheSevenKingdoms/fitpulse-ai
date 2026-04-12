const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },

   inputData: {
        age: String,
        bmr: String,
        gender: String,
        wakeUpTime: String,
        bedTime: String,
        jobType: String,
        commuteDistance: String,
        dailyWalk: String,
        doesSmoke: String,
        doesDrinkAlcohol: String,
        mealCount: String,
        doesSkipLunch: String,
        junkFoodFreq: String,
        nonVegFreq: String,
        mealDescription: String,
        dietType: String,
        waterIntake: String,
        workoutPlace: String,
        calisthenics: String,
        muscleTraining: String,
        bodyPart: String,
        workoutRoutine: String,
        bloodSugarLevels: String,
        bloodPressureRange: String,
        cholestrol: String,
        medicalConditions: String
    }, // questionnaire data
    result: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }],
    error: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);