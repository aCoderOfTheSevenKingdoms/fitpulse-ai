const express = require('express');

// Middlewares
const { 
    authMiddleware,
    validateSignupMiddleware, 
    validateLoginMiddleware,  
} = require('../middlewares/auth.middleware');

// Controllers
const { 
    googleLogin, 
    userCheck,
    userRegister,
    userLogin,
    userLogout,
    forgotPassword,
    resetPassword 
} = require('../controllers/auth.controller');

const router = express.Router();

router.get('/me', authMiddleware, userCheck);
router.post('/register', validateSignupMiddleware, userRegister);
router.post('/login', validateLoginMiddleware, userLogin);
router.post('/google', googleLogin);
router.post('/logout', authMiddleware, userLogout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
