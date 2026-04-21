const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');

// @desc  Get user profile by ID
// @route GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let mentorProfile = null;
    if (user.role === 'mentor') {
      mentorProfile = await MentorProfile.findOne({ userId: user._id });
    }

    res.json({ user, mentorProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update own profile
// @route PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'bio', 'college', 'graduationYear', 'industry', 'skills', 'careerGoals', 'profilePhoto'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // If a file was uploaded via multer/cloudinary
    if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update mentor profile (mentor only)
// @route PUT /api/users/me/mentor-profile
const updateMentorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can update mentor profile' });
    }

    const allowedFields = ['currentCompany', 'jobTitle', 'yearsOfExperience', 'isAvailable', 'maxMentees', 'expertise', 'careerJourney', 'linkedinUrl'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const profile = await MentorProfile.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ mentorProfile: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Deactivate account
// @route DELETE /api/users/me
const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ message: 'Account deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserById, updateProfile, updateMentorProfile, deactivateAccount };