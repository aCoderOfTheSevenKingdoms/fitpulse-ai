const { registerSchema, loginSchema } = require('./schema/auth.schema');
const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');

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
                message: parsed.error.issues?.[0]?.message || "Invalid input",
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
                message: parsed.error.issues?.[0]?.message || "Invalid input",
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
    errorHandlerMiddleware
};