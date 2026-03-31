// Models
const ProgressLog = require('../models/progressLog.model');
const DailyProgress = require('../models/dailyProgress.model');
const Goal = require('../models/goals.model');

// Services
const { generatePrompt, computeMetrics, evaluateProgress } = require('../services/progress.service');

const progressLog = async (req,res) => {

    // Payload
    const {
        goalId,
        mealDescription,
        workoutDescription,
        sleepHours,
        stepCount,
        workoutDuration
    } = req.body;

    // Get date
    const date = new Date();

    try{

        // Save progress log
        await ProgressLog.create({
            userId: req.userId,
            goalId,
            date: date.toISOString().split('T')[0],
            progressInput: {
                rawData: { // This raw data is to be given to AI
                    mealDescription,
                    workoutDescription
                },
                inputMetrics: {
                    sleepHours,
                    stepCount,
                    workoutDuration
                }
            }
        });

        // Generate prompt to compute some metrics
        const prompt = generatePrompt(mealDescription, workoutDescription);

        // Compute some metrics from raw user inputs
        const response = await computeMetrics(prompt);

        // Return in case of failure in computing metrics
        if(!response){
            return res.status(503).json({
                message: "LLM API Failure while computing some values"
            })
        }

        // Check if targets are met or not
        let targets = {};
        let progressInputs = {
            burnCalories: response.caloriesBurnt,
            consumeCalories: response.caloriesConsumed,
            steps: stepCount,
            workoutDuration,
            sleepHours,
            proteinGrams: response.proteinGrams
        }

            // Fetch the goal user want to update 
        const currentGoal = await Goal.findOne({
            _id: goalId,
            userId: req.userId
        });
        
        if (!currentGoal) {
            return res.status(404).json({ message: "Invalid goal" });
        }
        
        targets = currentGoal.metrics;

        const goalStatus = evaluateProgress(targets, progressInputs); 

        const isGoalCompleted = Object.values(goalStatus).every(Boolean);

        // Update goal status to completed
        if(isGoalCompleted){
            currentGoal.completedAt = date;
        }
        await currentGoal.save();

        // Update Daily progress
        const existing = await DailyProgress.findOne({ userId: req.userId, date: date.toISOString().split('T')[0] });

        let streakCount = 0;

        if (isGoalCompleted) {
           streakCount = existing ? existing.streakCount + 1 : 1;
        } else {
           streakCount = 0;
        }

        const dailyProgress = await DailyProgress.findOneAndUpdate(
            { userId: req.userId, date: date.toISOString().split('T')[0] },
            {
                $inc: {
                    "totals.caloriesConsumed": response.caloriesConsumed,
                    "totals.caloriesBurnt": response.caloriesBurnt,
                    "totals.proteinGrams": response.proteinGrams,
                    "totals.stepCount": stepCount,
                    "totals.sleepHours": sleepHours,
                    "totals.workoutDuration": workoutDuration
                },
                $set: {
                    streakCount,
                    goalStatus,
                    isGoalCompleted
                }
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            message: "Progress logged successfully✅",
            completedAt: currentGoal.completedAt,
            streakCount: dailyProgress.streakCount,
            totalCaloriesBurnt: dailyProgress.totals.caloriesBurnt
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}

const todayProgress = (req,res) => {}

const progressHistory = (req,res) => {}

module.exports = {
    progressLog,
    todayProgress,
    progressHistory
}