const jwt = require('jsonwebtoken');
const ChatRoom = require('../models/ChatRoom');

const socketHandler = (io) => {
  // Authenticate socket connection via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.userId}`);

    // Join a chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
    });

    // Send a message
    socket.on('send_message', async ({ roomId, content, type = 'text' }) => {
      try {
        const room = await ChatRoom.findById(roomId);
        if (!room) return socket.emit('error', { message: 'Room not found' });

        // Verify sender is a participant
        const isParticipant = room.participants.some(
          (p) => p.toString() === socket.userId
        );
        if (!isParticipant) return socket.emit('error', { message: 'Not a participant' });

        const message = {
          senderId: socket.userId,
          content,
          type,
          readBy: [socket.userId],
          sentAt: new Date(),
        };

        room.messages.push(message);
        room.lastMessage = content;
        room.lastMessageAt = new Date();
        await room.save();

        // Get the saved message with its _id
        const savedMessage = room.messages[room.messages.length - 1];

        // Broadcast to all in room (including sender for confirmation)
        io.to(roomId).emit('message_received', {
          roomId,
          message: savedMessage,
        });
      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('user_typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping,
      });
    });

    // Mark messages as read
    socket.on('mark_read', async ({ roomId }) => {
      try {
        await ChatRoom.updateMany(
          { _id: roomId, 'messages.readBy': { $ne: socket.userId } },
          { $addToSet: { 'messages.$[].readBy': socket.userId } }
        );
        socket.to(roomId).emit('messages_read', { roomId, userId: socket.userId });
      } catch (error) {
        console.error('mark_read error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.userId}`);
    });
  });
};

module.exports = socketHandler;