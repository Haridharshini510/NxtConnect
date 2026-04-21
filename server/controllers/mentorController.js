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

// @desc  Get all mentors
// @route GET /api/mentors
const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    const mentorsWithProfiles = await Promise.all(
      mentors.map(async (mentor) => {
        const profile = await MentorProfile.findOne({ userId: mentor._id });
        return { ...mentor.toObject(), mentorProfile: profile };
      })
    );
    res.json({ mentors: mentorsWithProfiles });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get matched mentors for student
// @route GET /api/mentors/matched
const getMatchedMentors = async (req, res) => {
  try {
    // Simple matching logic: mentors with similar skills or industry
    const student = await User.findById(req.user._id);
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    const matched = await Promise.all(
      mentors.map(async (mentor) => {
        const profile = await MentorProfile.findOne({ userId: mentor._id });
        // Basic matching: same industry or overlapping skills
        const matchScore = (mentor.industry === student.industry ? 1 : 0) +
                          (mentor.skills.some(skill => student.skills.includes(skill)) ? 1 : 0);
        return { ...mentor.toObject(), mentorProfile: profile, matchScore };
      })
    );
    matched.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ mentors: matched });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get mentor by user ID
// @route GET /api/mentors/:userId
const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.userId).select('-password');
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    const profile = await MentorProfile.findOne({ userId: mentor._id });
    res.json({ ...mentor.toObject(), mentorProfile: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update mentor availability
// @route PUT /api/mentors/availability
const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const profile = await MentorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { isAvailable },
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }
    res.json({ mentorProfile: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserById, updateProfile, updateMentorProfile, getMentors, getMatchedMentors, getMentorById, updateAvailability };