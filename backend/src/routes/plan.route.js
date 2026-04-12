const express = require('express');

// Controllers
const {
    generatePlan,
    getPlan
} = require('../controllers/plan.controller');

// Middlewares
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/generate-plan', authMiddleware, generatePlan);
router.get('/get-plan/:planId', authMiddleware, getPlan);

module.exports = router;