const { registerSchema, loginSchema } = require('./schema/auth.schema');
const Redis = require('ioredis');
const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
});

redis.on('error', (err) => {
    logger.error('Redis error:', err);
});

function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

function validateSignupMiddleware(req, res, next) {
    try {
        const payload = req.body;
        const parsed = registerSchema.safeParse(payload);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.issues
            });
            return;
        }
        req.body = parsed.data;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

function validateLoginMiddleware(req, res, next) {
    try {
        const payload = req.body;
        const parsed = loginSchema.safeParse(payload);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsed.error.issues
            });
            return;
        }
        req.body = parsed.data;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

async function rateLimitAuthMiddleware(req, res, next) {
    try {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;
        const count = await redis.get(key);
        if (count) {
            res.status(429).json({
                success: false,
                message: "Too many requests"
            });
            return;
        }
        await redis.set(key, 1, "EX", 60);
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

function errorHandlerMiddleware(req, res, next) {
    try {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    } catch (error) {

    }
}

module.exports = {
    authMiddleware,
    validateSignupMiddleware,
    validateLoginMiddleware,
    rateLimitAuthMiddleware,
    errorHandlerMiddleware
};