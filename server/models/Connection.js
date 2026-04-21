const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestMessage: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'declined', 'closed'],
    default: 'pending',
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate connections
connectionSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);