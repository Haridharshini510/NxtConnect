const express = require('express');
const router = express.Router();
const { getRoadmaps, getRoadmapById, createRoadmap, updateRoadmap } = require('../controllers/roadmapController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getRoadmaps);
router.get('/:id', protect, getRoadmapById);
router.post('/', protect, requireRole('mentor', 'admin'), createRoadmap);
router.put('/:id', protect, requireRole('mentor', 'admin'), updateRoadmap);

module.exports = router;