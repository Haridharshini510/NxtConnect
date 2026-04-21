const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  updateMentorProfile,
  deactivateAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../cloudinary');
router.get('/:id', protect, getUserById);
router.put(
  '/me',
  protect,
  upload.single('profilePhoto'),
  updateProfile
);
router.put('/me/mentor-profile', protect, updateMentorProfile);
router.delete('/account', protect, deactivateAccount);
module.exports = router;
