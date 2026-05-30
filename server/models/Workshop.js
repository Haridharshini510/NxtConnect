const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 5000 },
    type: { type: String, enum: ['live', 'recorded'], default: 'live' },
    category: { type: String, default: '', maxlength: 100 }, // e.g. "Resume Review", "Mock Interview"
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetingLink: { type: String, default: '', maxlength: 300 },
    recordingUrl: { type: String, default: '', maxlength: 300 },
    maxCapacity: { type: Number, default: 100 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, maxlength: 40 }],
    isPublished: { type: Boolean, default: true },
    coverImage: { type: String, default: '' },
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
