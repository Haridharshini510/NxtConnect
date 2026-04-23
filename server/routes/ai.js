// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { getAIMatchedMentors } = require('../controllers/aiMatchController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/matched-mentors', protect, requireRole('student'), getAIMatchedMentors);

module.exports = router;