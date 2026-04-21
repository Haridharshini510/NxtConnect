const express = require('express');
const router = express.Router();
const {
  getWorkshops, getWorkshopById, createWorkshop,
  registerForWorkshop, unregisterFromWorkshop,
  updateWorkshop, deleteWorkshop,
} = require('../controllers/workshopController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getWorkshops);
router.get('/:id', protect, getWorkshopById);
router.post('/', protect, requireRole('mentor', 'admin'), createWorkshop);
router.post('/:id/register', protect, registerForWorkshop);
router.delete('/:id/register', protect, unregisterFromWorkshop);
router.put('/:id', protect, requireRole('mentor', 'admin'), updateWorkshop);
router.delete('/:id', protect, requireRole('mentor', 'admin'), deleteWorkshop);

module.exports = router;