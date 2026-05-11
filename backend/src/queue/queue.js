const {Queue} = require("bullmq");

const planQueue = new Queue("plan-generation", { 
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
    } 
});

module.exports = {
    planQueue
}