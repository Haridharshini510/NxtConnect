const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
    maxlength: [120, 'Company must be at most 120 characters'],
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [140, 'Title must be at most 140 characters'],
  },
  location: {
    type: String,
    trim: true,
    maxlength: [120, 'Location must be at most 120 characters'],
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    required: [true, 'Job type is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [4000, 'Description must be at most 4000 characters'],
  },
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement must be at most 200 characters'],
  }],
  isReferralAvailable: {
    type: Boolean,
    default: false,
  },
  applicationUrl: {
    type: String,
    trim: true,
    maxlength: [300, 'Application URL must be at most 300 characters'],
  },
  deadline: {
    type: Date,
  },
  industry: {
    type: String,
    trim: true,
    maxlength: [80, 'Industry must be at most 80 characters'],
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill must be at most 50 characters'],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);
