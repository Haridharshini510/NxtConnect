const ChatRoom = require('../models/ChatRoom');
const Connection = require('../models/Connection');

// @desc  Get chat room messages
// @route GET /api/chat/:roomId
const getMessages = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId)
      .populate('messages.senderId', 'name profilePhoto');

    if (!room) return res.status(404).json({ message: 'Chat room not found' });

    // Verify user is a participant
    const isParticipant = room.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    res.json({ messages: room.messages, roomId: room._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get all chat rooms for current user
// @route GET /api/chat/my-rooms
const getMyChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.user._id })
      .populate('participants', 'name profilePhoto role')
      .sort({ lastMessageAt: -1 });

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, getMyChatRooms };