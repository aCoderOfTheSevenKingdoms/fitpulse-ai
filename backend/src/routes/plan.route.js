const express = require('express');

// Controllers
const {
    generatePlan
} = require('../controllers/plan.controller');

// Middlewares
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware, generatePlan);

module.exports = router;