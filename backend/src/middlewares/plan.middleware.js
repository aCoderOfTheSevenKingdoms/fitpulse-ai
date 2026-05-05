const Plan = require('../models/plan.model');

const planGenerationLimiter = async (req,res,next) => {
    try {

       const planDoc = await Plan.find({ 
        userId: req.userId, 
       });
       if(planDoc) {
        return res.status(403).json({
            message: "Cannot generate more than one plan"
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