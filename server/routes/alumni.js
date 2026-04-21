const express = require('express');
const router = express.Router();
const { getAlumni, getAllColleges, getAlumniJourney } = require('../controllers/alumni');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAlumni);
router.get('/colleges', protect, getAllColleges);
router.get('/:id/journey', protect, getAlumniJourney);

module.exports = router;