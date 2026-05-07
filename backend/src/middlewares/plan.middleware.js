const Plan = require('../models/plan.model');

const planGenerationLimiter = async (req,res,next) => {
    try {

       const plans = await Plan.find({ 
        userId: req.userId,
        status: "completed"
       });
       if(plans.length === 2) {
        return res.status(403).json({
            message: "Cannot generate more than two plans"
        })
       }
       
       next();

    } catch (error) { 
       res.status(500).json({
        message: "Internal server error"
       })
    }
}

module.exports = {
    planGenerationLimiter
}