// Services
const {
    generatePrompt,
    computePlan,
    generateGoalDates
} = require('../services/plan.service');

// DB Models
const User = require('../models/user.model');
const Goal = require('../models/goals.model');

const generatePlan = async (req,res) => {
    
    try{
       
        const userActivityDetails = req.body;

        if(!userActivityDetails){
            return res.status(422).json({ 
                message: "Please provide important details to generate plan" 
            });
        }
    
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Put user activity details in DB
        const allowedFields = Object.keys(user.activityDetails);

        allowedFields.forEach(field => {
            if(userActivityDetails[field] !== undefined){
                user.activityDetails[field] = userActivityDetails[field];
            }
        });

        if(user.isNewUser){
            user.isNewUser = false;
        }
        await user.save();

        // Call PromptService to generate prompt
        const planPrompt = generatePrompt(userActivityDetails);

        // Fetch roadmap api call
        const result = await computePlan(planPrompt);

        if (!result || !result.goals) {
            return res.status(503).json({
                message: "LLM API Failure"
            });
        }

        const goals = result.goals;

        // Set dates for each goal
        const goalsWithDates = generateGoalDates(goals);

        // Store goals in DB
        const storedGoals = await Goal.insertMany(
            goalsWithDates.map(goal => ({
                ...goal,
                userId: req.userId
            }))
        );

        if(!storedGoals || storedGoals.length !== 90){
            return res.json({
                message: "Some error occured while storing goals in DB"
            })
        }

        res.status(200).json({
            message: "Roadmap generated successfully✅",
            goals: storedGoals
        })

    } catch(error) {
        console.error(error.message);
        res.status(500).json({
            message: "Error while generating roadmap",
            err: error.message
        })
    }    
}

module.exports = {
    generatePlan
}