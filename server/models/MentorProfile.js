const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentCompany: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  maxMentees: {
    type: Number,
    default: 5,
    min: 1,
  },
  currentMenteesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  expertise: [{
    type: String,
    trim: true,
  }],
  careerJourney: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);