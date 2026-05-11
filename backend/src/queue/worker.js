require("dotenv").config();

const mongoose = require("mongoose");
const logger = require('../utils/logger');

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("Worker DB connected ✅"))
  .catch(err => logger.error(`Worker DB error ❌ ${err}`));

const {Worker} = require("bullmq");

// Models
const Plan = require("../models/plan.model");
const Goal = require("../models/goals.model");

// Services
const {
    generatePrompt,
    generateGoalDates,
    computePlan
} = require("../services/plan.service");

const worker = new Worker(
    "plan-generation",
    async (job) => {

      const { userId, planId, inputData } = job.data;

      try {

        const planDoc = await Plan.findById(planId);
        if(!planDoc){
          throw new Error(`Plan ${planId} not found. Aborting job`);
        }

        logger.info(`Processing plan: ${planId}`);

         // Call PromptService to generate prompt
              const planPrompt = generatePrompt(inputData);
              logger.info("Prompt Generated");
              // Fetch roadmap api call
              const result = await computePlan(planPrompt);
      
              if (!result || !result.goals) {
                logger.error("LLM INVALID OUTPUT");
                await Plan.findByIdAndUpdate(planId, {
                    status: "failed",
                    error: "LLM API FAILURE"
                });
                return;
              }

              const goals = result.goals;

              // Set dates for each goal
              const goalsWithDates = generateGoalDates(goals);
              logger.info("Goals' dates generated successfully");
      
              // Store goals in DB
              const storedGoals = await Goal.insertMany(
                  goalsWithDates.map(goal => ({
                      ...goal,
                      userId
                  }))
              );
      
              if(!storedGoals || storedGoals.length !== 90){
                logger.error("GENERATED GOALS COULDN'T BE STORED IN DB");
                await Plan.findByIdAndUpdate(planId, {
                    status: "failed",
                    error: "ERROR WHILE STORING GOALS IN DB"
                })
                return;
              }
              logger.info("Goals stored successfully in DB");

              logger.info("ROADMAP GENERATED SUCCESSFULLY✅");
              await Plan.findByIdAndUpdate(planId, {
                status: "completed",
                result: storedGoals.map(goal => goal._id)
              })
      } catch(error) {
           await Plan.findByIdAndUpdate(planId, {
            status: "failed",
            error: error.message
           })
      }
    },
    { 
      connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      } 
    }
)

worker.on("failed", async (job,err) => {
  logger.info(`Job ${job.id} failed: ${err.message}`);
  if(job.attemptsMade >= job.opts.attempts){
    await Plan.findByIdAndUpdate(job.data.planId, {
      status: "failed",
      error: err.message
    });
  }
});