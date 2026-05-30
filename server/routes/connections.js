const express = require('express');
const router = express.Router();
const {
  requestConnection, acceptConnection, declineConnection, getMyConnections,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');
const { requestConnectionValidation } = require('../middleware/validation');
 
router.post('/request', protect, requestConnectionValidation, requestConnection);
router.get('/my', protect, getMyConnections);
router.put('/:id/accept', protect, acceptConnection);
router.put('/:id/decline', protect, declineConnection);
 
module.exports = router;
