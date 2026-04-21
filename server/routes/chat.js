const express = require('express');
const router = express.Router();
const { getMessages, getMyChatRooms } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/my-rooms', protect, getMyChatRooms);
router.get('/:roomId', protect, getMessages);

module.exports = router;