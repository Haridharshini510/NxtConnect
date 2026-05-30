const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { createOrUpdateJobValidation } = require('../middleware/validation');

router.get('/', protect, getJobs);
router.post('/', protect, createOrUpdateJobValidation, createJob);
router.put('/:id', protect, createOrUpdateJobValidation, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
