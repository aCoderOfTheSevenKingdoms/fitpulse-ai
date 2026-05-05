const { llmAPIcall } = require('./ai.service');
const { sanitizeLLMoutput } = require('../utils/progress.utilities');
const User = require('../models/user.model');
const DailyProgress = require('../models/dailyProgress.model');
const mongoose = require("mongoose");
const logger = require('../utils/logger');

/**
 * This service checks if goals are met or not.
 */

const evaluateProgress = (targets = {}, progress = {}) => {
    const METRICS = [
        "burnCalories",
        "consumeCalories",
        "steps",
        "workoutDuration",
        "proteinGrams",
        "sleepHours"
    ];

    const result = {};

    METRICS.forEach((metric) => {
        const targetValue = targets[metric];
        const progressValue = progress[metric];

        // If target is missing or invalid → mark false
        if (typeof targetValue !== "number" || targetValue <= 0) {
            result[metric] = false;
            return;
        }

        // If progress is missing → treat as 0
        const safeProgress = (typeof progressValue === "number" && progressValue >= 0)
            ? progressValue
            : 0;

        const threshold = 0.6 * targetValue;

        result[metric] = safeProgress >= threshold;
    });

    return result;
};

/**
 * This service takes meal & workout description of user and makes an API call to a LLM to compute three values:
 * caloriesConsumed
 * caloriesBurnt
 * proteinGrams
 */

const computeMetrics = async (prompt) => {
    if (!prompt) return null;

    try {

        const rawOutput = await llmAPIcall(prompt, 0, 100);

        // Attempt to parse JSON
        let parsed;

        try{
            parsed = JSON.parse(rawOutput);
        } catch (error) {
            console.error("Invalid JSON output from LLM:", error.message);
            throw new Error("Invalid JSON output from LLM");
        }

        // Sanitize the parsed object
        parsed = sanitizeLLMoutput(parsed);

        return parsed;

    } catch (error) {
        logger.error("LLM API FAILURE:", error.message);
        return null;
    }
}

/**
 * This service generates the prompt to put in LLM API call
 */
const generatePrompt = (mealDescription, workoutDescription) => {

    if(!mealDescription && !workoutDescription) return null;

    const prompt = `You are a strict data parser and nutrition/fitness estimator.

    Your task is to analyze the given user input and return ONLY a valid JSON object with EXACTLY the following three integer fields:

    - caloriesConsumed
    - caloriesBurnt
    - proteinGrams

    IMPORTANT RULES (MUST FOLLOW STRICTLY):

    1. Output ONLY valid JSON. Do NOT include any explanation, text, markdown, or comments.
    2. All values MUST be integers (no decimals, no strings, no nulls).
    3. If any value cannot be determined, return 0 for that field.
    4. Do NOT add extra fields. Do NOT rename fields.

    INPUT DATA:

    User's Meal Description: ${mealDescription}
    User's Workout Description: ${workoutDescription}

    INSTRUCTIONS:

    - Use ONLY mealDescription to calculate:
    → caloriesConsumed
    → proteinGrams

    - Use ONLY workoutDescription to calculate:
    → caloriesBurnt

    - If mealDescription is empty or irrelevant, set:
    → caloriesConsumed = 0
    → proteinGrams = 0

    - If workoutDescription is empty or irrelevant, set:
    → caloriesBurnt = 0

    - Use realistic approximations based on common nutrition and fitness data.

    OUTPUT FORMAT (STRICT):

    {
    "caloriesConsumed": <integer>,
    "caloriesBurnt": <integer>,
    "proteinGrams": <integer>
    }`;

    return prompt;
}

/**
 * This service calcultes the effectiveness score of a particular user.
*/

const calculateEffectiveness = async (userId, streakCount) => {

    try{

        /**
         * From DailyProgress model
         * Compute how many logs were made in the past 7 days
         * by the user of _id: userId
         * The number of logs will be the base score
        */

        logger.info("userId:", userId);
        logger.info("typeof userId:", typeof userId);

        const user = await User.findById(userId);
        logger.info("user:", user);

        const logs = await DailyProgress.aggregate([
            // 1. Match logs for user in last 7 days
            {
                $match: {
                userId: new mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
                }
            },

            // 2. Sort by createdAt (earliest first)
            {
                $sort: { createdAt: 1 }
            },

            // 3. Group by day (YYYY-MM-DD)
            {
                $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                earliestLog: { $first: "$$ROOT" } // first = earliest (because sorted)
                }
            },

            // 4. Replace root with the actual document
            {
                $replaceRoot: { newRoot: "$earliestLog" }
            }
        ]);

        logger.info("Progress logs: ", logs);

        const baseScore = logs.length;
        
        /**
         * Compute the difficulty multiplier from the date the user joined.
         * User model will be used
        */

        const userCreatedDate = new Date(user.createdAt);
        logger.info("User created at: ", userCreatedDate);


        // difference in milliseconds
        const diffInMs = Date.now() - userCreatedDate;
        logger.info("Diff in ms: ", diffInMs);

        // in days
        const daysSinceJoined = Math.max(1, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));

        const difficulty = 1 + Math.round(daysSinceJoined/30);

        // Compute the final effectiveness score
        let effectiveness = Math.round(baseScore/difficulty)*10; // scale to 0-70
        if(isNaN(effectiveness)) effectiveness = 0;
        logger.info("Effectivenss score: ", effectiveness);
        logger.info("Streak count: ", streakCount);

        // Add a cap to 100 with extra bonuses
        let streakBonus = 0;
        if (streakCount >= 30) {
            streakBonus += 20;
        } else if (streakCount >= 10) {
            streakBonus += 10;
        } else if (streakCount >= 5) {
            streakBonus += 5;
        }
        logger.info("Streak Bonus: ", streakBonus);
        effectiveness = Math.min(100, effectiveness + streakBonus);
        logger.info("Final Effectiveness score: ", effectiveness);

        return effectiveness;

    } catch (error) {
        logger.error("Error while calculating effectiveness score: ", error);
        throw error;
    }
}

/**
 * This service fetches the progress stats of the past 7 days 
 * from the DailyProgress db model wraps them in an array of objects
 * and returns it.
*/

const fetchProgressStats = async (userId, logDate) => {

    try{
       
        const logDateObj = new Date(logDate);

        const lastWeekDocs = await DailyProgress.find({
            userId,
            date: {
                $gte: new Date(logDateObj.getMilliseconds() - 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
            }
        });

        const stats = lastWeekDocs.map((doc) => {
            return {
                day: new Date(doc.date).getDay(),
                caloriesBurnt: doc.totals.caloriesBurnt,
                sleepDuration: doc.totals.sleepHours,
                proteinConsumption: doc.totals.proteinGrams,
                workoutMinutes: doc.totals.workoutDuration,
                dailySteps: doc.totals.stepCount,
                isGoalCompleted: doc.isGoalCompleted
            }
        });

        return stats;

    } catch (error) {
        logger.error(error.message);
        throw new Error("Some error occured while fetching weekly progress stats");
    }
}

/**
 * This service resets the broken streaks of all the users with an active streak 
*/
const resetBrokenStreaks = async () => {

   // Get Yesterday's date string
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   const yesterdayStr = yesterday.toISOString().split('T')[0];

   // Find all the users who had an active streak (streakCount > 0)
   // but did not logged progress yesterday
   const usersWithStreak = User.find({streakCount : {$gt: 0}});

   for(const user of usersWithStreak){
    const yesterdayLog = await DailyProgress.findOne({
        userId: user._id,
        date: yesterdayStr,
        isGoalCompleted: true
    });

    if(!yesterdayLog){
        // No completed log yesterday -> streak breaks
        await User.findByIdAndUpdate(user._id, {streakCount: 0});
        logger.info(`[Streak] Reset streak for user ${user._id}`);
    }
   }
}

module.exports = {
    computeMetrics,
    generatePrompt,
    evaluateProgress,
    calculateEffectiveness,
    fetchProgressStats,
    resetBrokenStreaks
}