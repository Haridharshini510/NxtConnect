const express = require('express');
const router = express.Router();
const { uploadResume, uploadProfilePhoto } = require('../controllers/upload');
const { protect } = require('../middleware/auth');
const { upload } = require('../cloudinary');

router.post(
  '/resume',
  protect,
  upload.single('resume'),
  uploadResume
);

router.post(
  '/profile-photo',
  protect,
  upload.single('profilePhoto'),
  uploadProfilePhoto
);

module.exports = router;