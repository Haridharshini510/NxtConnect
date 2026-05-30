// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { getAIMatchedMentors } = require('../controllers/aiMatchController');
const { protect, requireRole } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const aiMatchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: 'ai-match',
  message: 'Too many matching requests. Please wait and try again.',
});

router.get('/matched-mentors', protect, aiMatchLimiter, requireRole('student'), getAIMatchedMentors);

module.exports = router;
