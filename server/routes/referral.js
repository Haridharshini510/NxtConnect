const express = require('express');
const router = express.Router();
const {
  createReferral, getMyReferrals, updateReferralStatus, getReferrableMentees,
} = require('../controllers/referral');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReferral);
router.get('/my', protect, getMyReferrals);
router.get('/mentees', protect, getReferrableMentees);
router.put('/:id/status', protect, updateReferralStatus);

module.exports = router;