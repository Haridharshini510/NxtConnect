const Notification = require('../models/Notification');

/**
 * Create a notification in DB and push it to the recipient in real-time via Socket.io.
 * @param {object} io - Socket.io server instance
 * @param {object} data - Notification fields
 */
const createNotification = async (io, { userId, type, title, body, link = '', fromUser = null, meta = {} }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      body,
      link,
      fromUser,
      meta,
    });

    // Push real-time to the recipient if they're connected
    if (io) {
      io.to(`user:${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (err) {
    console.error('createNotification error:', err.message);
  }
};

module.exports = { createNotification };
