const express = require('express');
const router = express.Router();
const {
  requestConnection, acceptConnection, declineConnection, getMyConnections,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');
 
router.post('/request', protect, requestConnection);
router.get('/my', protect, getMyConnections);
router.put('/:id/accept', protect, acceptConnection);
router.put('/:id/decline', protect, declineConnection);
 
module.exports = router;