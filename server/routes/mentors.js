const express = require('express');
const router = express.Router();
const { getMentors, getMatchedMentors, getMentorById, updateAvailability } = require('../controllers/mentorController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getMentors);
router.get('/matched', protect, requireRole('student'), getMatchedMentors);
router.get('/:userId', protect, getMentorById);
router.put('/availability', protect, requireRole('mentor'), updateAvailability);

module.exports = router;