// DB Models
const User = require('../models/user.model');
const Plan = require('../models/plan.model');
const { planQueue } = require('../queue/queue');
const logger = require('../utils/logger');

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

        // Check if any workers are listening before queuing
        const workers = await planQueue.getWorkers();
        logger.error(`Workers Deployed: ${workers.length}`);
        if(workers.length == 0){
            return res.status(500).json({
                message: "Plan Generation Failed"
            })
        }

        /**
         * Create a new plan document in DB
         * put the userActivityDetails in the inputData field 
        */
        const planDoc = await Plan.create({
            userId: req.userId,
            status: "pending",
            inputData: userActivityDetails
        });

        if(user.isNewUser){
            user.isNewUser = false;
        }
        await user.save();

        // Add the plan generation job to queue
        await planQueue.add("generate-plan", {
            userId: req.userId,
            planId: planDoc._id,
            inputData: planDoc.inputData
        }, {
            attempts: 2,
            backoff: {
                type: "exponential",
                delay: 2000
            }
        });

        res.json({
            message: "Roadmap generation inititated ⏳",
            planId: planDoc._id
        })

    } catch(error) {
        logger.error(error);
        res.status(500).json({
            message: "Error while generating roadmap",
            err: error.message
        })
    }    
}

const getPlan = async (req, res) => {
    try {
        const {start = 0, limit = 30} = req.query; 
        const { planId } = req.params;
        let plan = null;

        if (planId === "latest") {
            plan = await Plan.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        } else {
            plan = await Plan.findById(planId);
        }

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        if (String(plan.userId) !== String(req.userId)) {
            return res.status(403).json({
                message: "Unauthorized access to plan"
            });
        }

        if (plan.status === "failed") {
            return res.json({
                message: "Plan generation failed",
                status: "failed",
                error: plan.error || "Some error occured"
            });
        }

        let goals = null;

        if (plan.status === "completed") {
            const populatedPlan = await plan.populate("result");
            goals = populatedPlan.result.slice(
                Number(start),
                Number(start) + Number(limit)
            ).map((goal) => goal.toObject())
        }

        return res.json({
            planId: plan._id,
            status: plan.status,
            goals
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: "Error fetching plan",
            error: error.message
        });
    }
};

module.exports = {
    generatePlan,
    getPlan
}