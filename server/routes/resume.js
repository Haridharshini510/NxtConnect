const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getMyResume, saveResume, analyzeMyResume, generateBullet, uploadMyResumePdf, getUploadedResumeUrl } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const { magicFileTypeGuard, enforceUploadQuota, optionalMalwareScan } = require('../middleware/uploadSecurity');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  keyPrefix: 'resume-ai',
  message: 'Too many AI requests. Please wait and try again.',
});
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  keyPrefix: 'resume-upload',
  message: 'Too many upload attempts. Please wait and try again.',
});

router.get('/', protect, getMyResume);
router.get('/uploaded-url', protect, getUploadedResumeUrl);
router.put('/', protect, saveResume);
router.post(
  '/upload',
  protect,
  uploadLimiter,
  upload.single('resume'),
  magicFileTypeGuard('pdf'),
  enforceUploadQuota({ kind: 'resume_pdf', maxFilesPerDay: 10, maxBytesPerDay: 25 * 1024 * 1024 }),
  optionalMalwareScan(),
  uploadMyResumePdf
);
router.post('/analyze', protect, aiLimiter, analyzeMyResume);
router.post('/generate-bullet', protect, aiLimiter, generateBullet);

module.exports = router;
