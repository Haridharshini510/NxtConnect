const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    type: { type: String, enum: ['full-time', 'internship', 'part-time', 'contract'], default: 'full-time' },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'],
      default: 'saved',
    },
    appliedDate: { type: Date },
    interviewDate: { type: Date },
    salary: { type: String, default: '' },
    notes: { type: String, default: '', maxlength: 2000 },
    contacts: [
      {
        name: { type: String },
        role: { type: String },
        linkedIn: { type: String },
      },
    ],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    source: { type: String, default: '' }, // e.g. "LinkedIn", "Referral", "NextConnect"
    referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' }, // if applied via referral
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);