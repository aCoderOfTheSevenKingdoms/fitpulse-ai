const express = require('express');

// Middlewares
const { 
    authMiddleware,
    rateLimitAuthMiddleware, 
    validateSignupMiddleware, 
    validateLoginMiddleware,  
} = require('../middlewares/auth.middleware');

// Controllers
const { 
    googleLogin, 
    userCheck,
    userRegister,
    userLogin,
    setPassword,
    userLogout,
    forgotPassword,
    resetPassword 
} = require('../controllers/auth.controller');

const router = express();

router.get('/me', authMiddleware, userCheck);
router.post('/register', rateLimitAuthMiddleware, validateSignupMiddleware, userRegister);
router.post('/login', rateLimitAuthMiddleware, validateLoginMiddleware, userLogin);
router.post('/google', rateLimitAuthMiddleware, googleLogin);
router.post('/set-password', rateLimitAuthMiddleware, setPassword);
router.post('/logout', authMiddleware, userLogout);
router.post('/forgot-password', rateLimitAuthMiddleware, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
