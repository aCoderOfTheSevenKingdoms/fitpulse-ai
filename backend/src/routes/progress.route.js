const express = require('express');
const router = express.Router();

// Middlewares
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
    progressInputValidation,
    checkDuplicateLogs
} = require('../middlewares/progress.middleware');
const upload = require('../middlewares/imgUpload.middleware');

// Controllers
const {
    progressLog,
    uploadTransformationPhoto,
    deleteTransformationPic
} = require('../controllers/progress.controller');

router.post('/log', 
    authMiddleware,  
    checkDuplicateLogs, 
    progressInputValidation, 
    progressLog
);

router.post('/upload-pic', 
    authMiddleware, 
    upload.single("image"), 
    uploadTransformationPhoto
);

router.delete('/delete-pic/:imgId', 
    authMiddleware, 
    deleteTransformationPic
);

module.exports = router;