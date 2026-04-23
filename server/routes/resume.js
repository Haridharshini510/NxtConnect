const express = require('express');
const router = express.Router();
const { getMyResume, saveResume, analyzeMyResume, generateBullet } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyResume);
router.put('/', protect, saveResume);
router.post('/analyze', protect, analyzeMyResume);
router.post('/generate-bullet', protect, generateBullet);

module.exports = router;