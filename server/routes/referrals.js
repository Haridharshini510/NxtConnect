const express = require('express');
const router = express.Router();
const { requestReferral, getReferrals, respondToReferral, deleteReferral } = require('../controllers/referralController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getReferrals);
router.post('/', protect, requireRole('student'), requestReferral);
router.put('/:id/respond', protect, requireRole('mentor'), respondToReferral);
router.delete('/:id', protect, requireRole('student'), deleteReferral);

module.exports = router;