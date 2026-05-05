const cron = require('node-cron');
const {resetBrokenStreaks} = require('../services/progress.service');
const logger = require('../utils/logger');

const startStreakResetJob = () => {
    cron.schedule('5 0 * * *', async () => {
        logger.info("[Cron] running streak reset job...");
        // call the reset broken streaks service
        await resetBrokenStreaks();
    });
};

module.exports = {
    startStreakResetJob
}
