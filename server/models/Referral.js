const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    jobUrl: { type: String, default: '' },
    message: { type: String, maxlength: 1000, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'declined', 'referred'], default: 'pending' },
    mentorNote: { type: String, maxlength: 1000, default: '' },
    referredAt: { type: Date },

    // Legacy fields kept optional for compatibility with older referral flow.
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referredTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    updatedByMentorAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate referral requests per student+mentor+company.
referralSchema.index({ studentId: 1, mentorId: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Referral', referralSchema);
