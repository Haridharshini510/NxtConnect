const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc  Register a new user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, college, graduationYear, industry, skills, careerGoals } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      passwordHash: password, // will be hashed by pre-save hook
      role: role || 'student',
      college,
      graduationYear,
      industry,
      skills: skills || [],
      careerGoals: careerGoals || [],
    });

    // If mentor, create a blank mentor profile automatically
    if (user.role === 'mentor') {
      await MentorProfile.create({ userId: user._id });
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc  Login
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc  Get currently logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @desc  Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = newPassword; // will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, changePassword };