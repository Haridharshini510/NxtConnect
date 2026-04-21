const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // mentor
      required: true,
    },
    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // student
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'interviewing', 'hired', 'rejected'],
      default: 'pending',
    },
    note: {
      type: String,
      maxlength: [500],
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    updatedByMentorAt: { type: Date },
  },
  { timestamps: true }
);

// One referral per student per job
referralSchema.index({ job: 1, referredTo: 1 }, { unique: true });

module.exports = mongoose.model('Referral', referralSchema);