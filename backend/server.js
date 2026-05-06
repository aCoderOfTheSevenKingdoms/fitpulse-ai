const dotenv = require('dotenv');
// INJECTING ENV VARIABLES
dotenv.config();
const logger = require('./src/utils/logger');

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
