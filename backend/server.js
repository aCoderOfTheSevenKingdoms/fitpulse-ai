const dotenv = require('dotenv');
// INJECTING ENV VARIABLES
dotenv.config();
const logger = require('./src/utils/logger');

logger.info(`REDIS_HOST: ${process.env.REDIS_HOST}`);
logger.info(`REDIS_PORT: ${process.env.REDIS_PORT}`);
logger.info(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD}`);

const app = require('./app');
const connectDB = require('./src/config/DBconnection');

// JOBS
const {startStreakResetJob} = require('./src/jobs/streakReset.job');

// CONNECT TO THE DB
connectDB().then(() => {
    startStreakResetJob();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
