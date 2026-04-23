const express = require('express');
const router = express.Router();
const { getMentors, getMentorById, updateAvailability } = require('../controllers/mentorController');
const { getAIMatchedMentors } = require('../controllers/aiMatchController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getMentors);
// Keep this route for backward compatibility, but power it via AI matching.
router.get('/matched', protect, requireRole('student'), getAIMatchedMentors);
router.get('/:userId', protect, getMentorById);
router.put('/availability', protect, requireRole('mentor'), updateAvailability);

module.exports = router;
