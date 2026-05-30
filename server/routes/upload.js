const express = require('express');
const router = express.Router();
const { uploadResume, uploadProfilePhoto } = require('../controllers/upload');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { magicFileTypeGuard, enforceUploadQuota, optionalMalwareScan } = require('../middleware/uploadSecurity');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  '/resume',
  protect,
  upload.single('resume'),
  magicFileTypeGuard('pdf'),
  enforceUploadQuota({ kind: 'resume_pdf', maxFilesPerDay: 10, maxBytesPerDay: 25 * 1024 * 1024 }),
  optionalMalwareScan(),
  uploadResume
);

router.post(
  '/profile-photo',
  protect,
  upload.single('profilePhoto'),
  magicFileTypeGuard('image'),
  enforceUploadQuota({ kind: 'profile_photo', maxFilesPerDay: 30, maxBytesPerDay: 20 * 1024 * 1024 }),
  optionalMalwareScan(),
  uploadProfilePhoto
);

module.exports = router;
