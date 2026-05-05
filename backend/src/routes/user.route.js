const express = require('express');

const router = express.Router();

// Middlewares
const upload = require('../middlewares/imgUpload.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Controllers
const {
    uploadAvatar,
    removeAvatar,
    updateProfile
} = require('../controllers/user.controller');

router.post(
    '/upload-avatar', 
    authMiddleware,
    upload.single("image"), 
    uploadAvatar
);

router.delete(
    '/remove-avatar',
    authMiddleware,
    removeAvatar
);

router.patch(
    '/update',
    authMiddleware,
    updateProfile
)

module.exports = router;
