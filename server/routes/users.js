const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  updateMentorProfile,
  deactivateAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { magicFileTypeGuard, enforceUploadQuota, optionalMalwareScan } = require('../middleware/uploadSecurity');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
router.get('/:id', protect, getUserById);
router.put(
  '/me',
  protect,
  upload.single('profilePhoto'),
  magicFileTypeGuard('image'),
  enforceUploadQuota({ kind: 'profile_photo', maxFilesPerDay: 30, maxBytesPerDay: 20 * 1024 * 1024 }),
  optionalMalwareScan(),
  updateProfile
);
router.put('/me/mentor-profile', protect, updateMentorProfile);
router.delete('/account', protect, deactivateAccount);
module.exports = router;
