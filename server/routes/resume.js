const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getMyResume, saveResume, analyzeMyResume, generateBullet, uploadMyResumePdf } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', protect, getMyResume);
router.put('/', protect, saveResume);
router.post('/upload', protect, upload.single('resume'), uploadMyResumePdf);
router.post('/analyze', protect, analyzeMyResume);
router.post('/generate-bullet', protect, generateBullet);

module.exports = router;
