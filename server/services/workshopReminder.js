const Workshop = require('../models/Workshop');
const User = require('../models/User');
const { sendWorkshopReminderEmail } = require('./email');
const { notifyWorkshopReminder } = require('./notification');

/**
 * Checks for workshops starting in the next hour and sends reminders.
 * Call this from index.js with setInterval every 60 minutes.
 */
const sendWorkshopReminders = async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const fiftyFiveMinLater = new Date(now.getTime() + 55 * 60 * 1000);

    // Find live workshops starting within the next ~1 hour window
    const upcomingWorkshops = await Workshop.find({
      type: 'live',
      isPublished: true,
      isCancelled: false,
      scheduledAt: { $gte: fiftyFiveMinLater, $lte: oneHourLater },
    });

    for (const workshop of upcomingWorkshops) {
      for (const attendee of workshop.attendees) {
        const user = await User.findById(attendee.user);
        if (!user) continue;

        // In-app notification
        await notifyWorkshopReminder(user._id, workshop.title, workshop._id);

        // Email reminder
        await sendWorkshopReminderEmail(user, workshop);
      }
    }

    if (upcomingWorkshops.length > 0) {
      console.log(`📅 Sent reminders for ${upcomingWorkshops.length} upcoming workshop(s).`);
    }
  } catch (error) {
    console.error('Workshop reminder job failed:', error.message);
  }
};

module.exports = { sendWorkshopReminders };