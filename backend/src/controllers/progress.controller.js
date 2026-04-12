// Models
const DailyProgress = require('../models/dailyProgress.model');
const Goal = require('../models/goals.model');

// Services
const { 
    generatePrompt, 
    computeMetrics, 
    evaluateProgress,
    calculateEffectiveness,
    fetchProgressStats
} = require('../services/progress.service');

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

    // Get date & userId
    const logDate = req.logDate;
    const userId = req.userId;

    try{

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
            userId
        });
        
        if (!currentGoal) {
            return res.status(404).json({ message: "Invalid goal" });
        }
        
        targets = currentGoal.metrics;

        const goalStatus = evaluateProgress(targets, progressInputs); 

        const isGoalCompleted = Object.values(goalStatus).every(Boolean);

        // Update goal status to completed
        if(isGoalCompleted){
            currentGoal.completedAt = new Date(logDate);
        }
        await currentGoal.save();

        // Update Daily progress model
        const yesterdayLogDate = new Date();
        yesterdayLogDate.setDate(new Date(logDate).getDate() - 1);

        const yesterdayProgress = await DailyProgress.findOne({ userId, date: yesterdayLogDate.toISOString().split('T')[0] });

        let streakCount = 0;

        if(yesterdayProgress && yesterdayProgress.isGoalCompleted){
            streakCount += yesterdayProgress.streakCount;

            if(isGoalCompleted){
                streakCount++;
            } else {
                streakCount = 0;
            }
        }

        // Effectiveness re-calculation
        const effectiveness = await calculateEffectiveness(userId, streakCount);

        await DailyProgress.create({
            userId,
            goalId,
            date: logDate,
            streakCount,
            effectivenessScore: effectiveness,
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
            },
            totals: {
                caloriesConsumed: response.caloriesConsumed,
                caloriesBurnt: response.caloriesBurnt,
                proteinGrams: response.proteinGrams,
                stepCount,
                sleepHours,
                workoutDuration
            },
            goalStatus,
            isGoalCompleted
        })

        // Fetch Weekly Progress Stats
        const stats = await fetchProgressStats(userId, logDate);
        if(!stats){
           return res.json({
            message: "Some error occured while fetching weekly progress stats"
           })
        }

        return res.status(200).json({
            message: "Progress logged successfully✅",
            completedAt: currentGoal.completedAt,
            streakCount,
            effectivenessScore: effectiveness,
            weeklyStats: stats
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