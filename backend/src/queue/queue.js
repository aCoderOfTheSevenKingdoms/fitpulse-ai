const {Queue} = require("bullmq");

const planQueue = new Queue("plan-generation", { 
    connection: {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null
    } 
});

module.exports = {
    planQueue
}