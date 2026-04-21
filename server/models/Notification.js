const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'connection_declined',
        'new_message',
        'session_booked',
        'session_reminder',
        'event_registered',
        'event_reminder',
        'feed_like',
        'feed_comment',
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String, default: '' }, // frontend route to navigate to on click
    isRead: { type: Boolean, default: false },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who triggered it
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // any extra data
  },
  { timestamps: true }
);

// Index for fast unread count queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);