const {progressInputSchema} = require('./schema/progessInput.schema');
const DailyProgress = require('../models/dailyProgress.model');

const progressInputValidation = (req,res,next) => {
    try{
        const payload = req.body;
        const parsedPayload = progressInputSchema.safeParse(payload);
        if(!parsedPayload.success){
            return res.status(400).json({
                message: "Invalid Inputs"
            });
        }
        next();
    } catch (error) {
        console.error("INTERNAL SERVER ERROR: ", error.message);
        res.status(500).json({
            message: "Some error occured while updating progress"
        })
    }
}

/**
 * This middleware checks if there's already a log exists from the same user on the same date 
*/

const checkDuplicateLogs = async (req,res,next) => {
    try{
        const userId = req.userId;
        const logDate = new Date().toISOString().split('T')[0];

        const existingLog = await DailyProgress.findOne({ userId, date: logDate });

        if(existingLog){
            return res.json({
                message: "Progress can only be logged once in a day"
            });
        }

        req.logDate = logDate;
        next();
    } catch (error) {
        console.error("INTERNAL SERVER ERROR: ", error.message);
        res.status(500).json({
            message: "Some error occured while logging progress"
        })
    }
}
const rateLimit = (req,res,next) => {}

module.exports = {
    rateLimit,
    checkDuplicateLogs,
    progressInputValidation
}