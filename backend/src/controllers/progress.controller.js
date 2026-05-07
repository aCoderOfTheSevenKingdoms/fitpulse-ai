const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

// Models
const DailyProgress = require('../models/dailyProgress.model');
const Goal = require('../models/goals.model');
const User = require('../models/user.model');

// Services
const { 
    generatePrompt, 
    computeMetrics, 
    evaluateProgress,
    calculateEffectiveness,
    fetchProgressStats
} = require('../services/progress.service');
const { uploadToCloudinary } = require('../services/imgUpload.service');

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

        const isCurrentGoalCompleted = Object.values(goalStatus).every(Boolean);

        // Update goal status to completed
        if(isCurrentGoalCompleted){
            currentGoal.completedAt = new Date(logDate);
        }
        currentGoal.isUpdated = true;
        await currentGoal.save();

        // Update Daily progress model
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const yesterdayProgress = await DailyProgress.findOne({ 
            userId, 
            date: yesterdayStr,
            isGoalCompleted: true
        });

        // Carry forward yesterday's streak only if it was completed
        const baseStreak = yesterdayProgress ? yesterdayProgress.streakCount : 0;
        const newStreak = isCurrentGoalCompleted ? baseStreak + 1 : 0; 

        // Effectiveness re-calculation
        const effectiveness = await calculateEffectiveness(userId, newStreak);

        await DailyProgress.create({
            userId,
            goalId,
            date: logDate,
            streakCount: newStreak,
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
            isGoalCompleted: isCurrentGoalCompleted
        })

        // Also update the streak in User so that the cron job can 
        // later query it efficiently
        await User.findByIdAndUpdate(userId, { streakCount: newStreak });

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
            streakCount: newStreak,
            effectivenessScore: effectiveness,
            weeklyStats: stats
        })

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}

const uploadTransformationPhoto = async (req,res) => {
   try{

    logger.info("File: ", req.file);

    if(!req.file){
        return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
        req.file.buffer,
        "progress"
    )

    logger.info(result);

    const userDoc = await User.findByIdAndUpdate(
        req.userId,
        {
            $push: {
                transformationPhotos: {
                    url: result.url,
                    publicId: result.publicId,
                    uploadedAt: new Date().toISOString().split('T')[0]
                }
            }
        },
        { new: true }
    );

    if(!userDoc){
        return res.json({
            message: "Invalid User or some error occured while uploading transformation pic"
        })
    }

    res.status(200).json({
        message: "Tranformation photo uploaded✅",
        photos: userDoc.transformationPhotos
    })

   } catch (error) {

    logger.error(error);
    res.status(500).json({
        message: "Some error occured while uploading transformation photo"
    })

   }
}

const deleteTransformationPic = async (req,res) => {
   try{

    const {imgId} = req.params;
    if(!imgId){
        return res.json({ message: "Image ID not received" });
    }

    const userDoc = await User.findById(req.userId);
    
    const imgObj = userDoc.transformationPhotos.find(
        (pic) => pic._id.toString() === imgId
    );

    if(!imgObj){
        return res.status(404).json({
            message: "Image not found"
        })
    }

    logger.info("Image public ID: ", imgObj.publicId);

    // Delete from Cloudinary
    const response = await cloudinary.uploader.destroy(imgObj.publicId);

    if(response.result !== "ok" && response.result !== "not found"){
        return res.status(500).json({
            message: "Cloudinary delete failed"
        })
    }

    // Delete from DB
    const updatedDoc = await User.findByIdAndUpdate(
        req.userId,
        {
            $pull: {
                "transformationPhotos": {
                    _id: imgId
                }
            }
        },
        {new: true}
    );

    if(!updatedDoc){
        return res.status(400).json({
            message: "Doc or image not found"
        })
    }

    res.json({
        message: "Image removed successfully⛔"
    })

   } catch (error) {
    logger.error(error);
    res.status(500).json({
        message: "Some error occured while removing pic"
    })
   }
};

module.exports = {
    progressLog,
    uploadTransformationPhoto,
    deleteTransformationPic
}