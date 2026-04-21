const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  type: { type: String, default: 'text' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentAt: { type: Date },
}, { _id: true });

const chatRoomSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    required: true,
    unique: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [messageSchema],
  lastMessage: {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    sentAt: Date,
  },
  lastMessageAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
