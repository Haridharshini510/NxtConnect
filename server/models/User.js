const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [80, 'Name must be at most 80 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    required: [true, 'Role is required'],
  },
  college: {
    type: String,
    trim: true,
    maxlength: [120, 'College must be at most 120 characters'],
  },
  graduationYear: {
    type: Number,
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
  careerGoals: [{
    type: String,
    trim: true,
    maxlength: [120, 'Career goal must be at most 120 characters'],
  }],
  profilePhoto: {
    type: String, // URL to cloudinary or local path
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: true,
  },
  emailVerifiedAt: {
    type: Date,
    default: Date.now,
  },
  emailVerificationTokenHash: {
    type: String,
    default: null,
  },
  emailVerificationExpiresAt: {
    type: Date,
    default: null,
  },
  refreshTokenHash: {
    type: String,
    default: null,
  },
  refreshTokenExpiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// For backwards compatibility
userSchema.methods.comparePassword = userSchema.methods.matchPassword;

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
