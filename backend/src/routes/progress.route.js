const express = require('express');
const router = express.Router();

// Middlewares
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
    progressInputValidation
} = require('../middlewares/progress.middleware');

// Controllers
const {
    progressLog,
    todayProgress,
    progressHistory
} = require('../controllers/progress.controller');

router.post('/log', authMiddleware, progressInputValidation, progressLog);
router.get('/today', authMiddleware, todayProgress);
router.get('/history', authMiddleware, progressHistory);

module.exports = router;