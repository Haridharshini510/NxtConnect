const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getApplications);
router.post('/', protect, createApplication);
router.get('/stats', protect, getStats);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
