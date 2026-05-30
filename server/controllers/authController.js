const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const { registerFailure, clearFailures } = require('../services/authAbuseService');

const ACCESS_COOKIE_NAME = 'accessToken';
const REFRESH_COOKIE_NAME = 'refreshToken';
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRE || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: maxAgeMs,
});

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const issueCsrfToken = (res, existingToken) => {
  const token = existingToken || crypto.randomBytes(32).toString('hex');
  res.cookie('csrfToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};

const generateAccessToken = (id) =>
  jwt.sign({ id, type: 'access' }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

const generateRefreshToken = (id) =>
  jwt.sign({ id, type: 'refresh' }, refreshSecret, { expiresIn: `${REFRESH_TOKEN_EXPIRES_DAYS}d` });

const setAuthCookies = async (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  await user.save();

  res.cookie(ACCESS_COOKIE_NAME, accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getCookieOptions(REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000)
  );
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE_NAME, { path: '/' });
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
};

// @desc  Register a new user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, college, graduationYear, industry, skills, careerGoals } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      registerFailure(req, 'register');
      return res.status(400).json({
        message: "We couldn't continue. Try signing in if you already have an account.",
      });
    }

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

    clearFailures(req, 'register');
    await setAuthCookies(res, user);
    res.status(201).json({ user });
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
    if (!user) {
      registerFailure(req, 'login');
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      registerFailure(req, 'login');
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    clearFailures(req, 'login');
    await setAuthCookies(res, user);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc  Refresh access token using refresh cookie
// @route POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (!decoded?.id) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ message: 'User not found or deactivated' });
    if (!user.refreshTokenHash || !user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const incomingHash = hashToken(refreshToken);
    if (incomingHash !== user.refreshTokenHash) {
      return res.status(401).json({ message: 'Refresh token mismatch' });
    }

    await setAuthCookies(res, user);
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};

// @desc  Logout current session
// @route POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (refreshToken) {
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, refreshSecret);
      } catch {
        decoded = null;
      }

      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null,
        });
      }
    }

    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// @desc  Check if email is already registered
// @route POST /api/auth/check-email
const checkEmail = async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const exists = await User.exists({ email });
    if (exists) {
      registerFailure(req, 'check-email');
      return res.status(400).json({
        message: "We couldn't continue. Try signing in if you already have an account.",
      });
    }

    clearFailures(req, 'check-email');
    res.json({ canProceed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while checking email' });
  }
};

// @desc  Get CSRF token
// @route GET /api/auth/csrf
const getCsrfToken = async (req, res) => {
  const token = issueCsrfToken(res, req.cookies?.csrfToken);
  res.json({ csrfToken: token });
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
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await user.save();
    clearAuthCookies(res);

    res.json({ message: 'Password changed successfully. Please log in again.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, checkEmail, getCsrfToken, refresh, logout, getMe, changePassword };
