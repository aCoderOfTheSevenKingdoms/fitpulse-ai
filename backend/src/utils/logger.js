const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    transports: [new winston.transports.Console()]
});

module.exports = logger;