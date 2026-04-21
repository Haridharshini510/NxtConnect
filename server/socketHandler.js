// server/socket/socketHandler.js — PHASE 2 REPLACEMENT
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ChatRoom = require('./models/ChatRoom');

const socketHandler = (io) => {
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

    // ── Each user joins their own private room for notifications ──
    socket.join(`user:${socket.userId}`);

    // ── Chat room events ──────────────────────────────────────────
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('send_message', async ({ roomId, content, type = 'text' }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
          return socket.emit('error', { message: 'Invalid chat room id' });
        }

        const trimmedContent = content?.trim();
        if (!trimmedContent) {
          return socket.emit('error', { message: 'Message content is required' });
        }

        const room = await ChatRoom.findById(roomId);
        if (!room) return socket.emit('error', { message: 'Room not found' });

        const isParticipant = room.participants.some((p) => p.toString() === socket.userId);
        if (!isParticipant) return socket.emit('error', { message: 'Not a participant' });

        const message = {
          _id: new mongoose.Types.ObjectId(),
          senderId: socket.userId,
          content: trimmedContent,
          type,
          readBy: [socket.userId],
          sentAt: new Date(),
        };

        await ChatRoom.updateOne(
          { _id: roomId },
          {
            $push: { messages: message },
            $set: {
              lastMessage: {
                senderId: socket.userId,
                content: trimmedContent,
                sentAt: message.sentAt,
              },
              lastMessageAt: message.sentAt,
            },
          }
        );

        io.to(roomId).emit('message_received', { roomId, message });

        // Push new_message notification to the other participant via their user room
        const otherId = room.participants.find((p) => p.toString() !== socket.userId);
        if (otherId) {
          io.to(`user:${otherId}`).emit('notification_badge'); // lightweight badge update
        }
      } catch (error) {
        console.error('send_message error:', error);
        socket.emit('error', { message: error.message || 'Failed to send message' });
      }
    });

    socket.on('user_typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user_typing', { userId: socket.userId, isTyping });
    });

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
      console.log(`🔌 Disconnected: ${socket.userId}`);
    });
  });
};

module.exports = socketHandler;
