const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleUserStatus, changeUserRole, getConnections, deletePost } = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/role', changeUserRole);
router.get('/connections', getConnections);
router.delete('/posts/:id', deletePost);

module.exports = router;