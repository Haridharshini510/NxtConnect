const User = require('../models/User');
const Connection = require('../models/Connection');
const Job = require('../models/Job');
const Workshop = require('../models/Workshop');
const FeedPost = require('../models/FeedPost');
const MentorProfile = require('../models/MentorProfile');

// @desc  Platform-wide stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [
      totalUsers, totalStudents, totalMentors,
      totalConnections, activeConnections,
      totalJobs, totalWorkshops, totalPosts,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'mentor', isActive: true }),
      Connection.countDocuments(),
      Connection.countDocuments({ status: 'active' }),
      Job.countDocuments({ isActive: true }),
      Workshop.countDocuments({ isPublished: true }),
      FeedPost.countDocuments({ isPublished: true }),
    ]);

    // New users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // User growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      stats: {
        totalUsers, totalStudents, totalMentors,
        totalConnections, activeConnections,
        totalJobs, totalWorkshops, totalPosts,
        newUsersThisMonth,
      },
      userGrowth,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get all users (paginated)
// @route GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Toggle user active status (ban/unban)
// @route PUT /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Change user role
// @route PUT /api/admin/users/:id/role
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'mentor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create mentor profile if promoting to mentor
    if (role === 'mentor') {
      await MentorProfile.findOneAndUpdate({ userId: user._id }, {}, { upsert: true, new: true });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get all connections (admin view)
// @route GET /api/admin/connections
const getConnections = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Connection.countDocuments(filter);
    const connections = await Connection.find(filter)
      .populate('studentId', 'name email college')
      .populate('mentorId', 'name email industry')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ connections, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete any post (admin moderation)
// @route DELETE /api/admin/posts/:id
const deletePost = async (req, res) => {
  try {
    await FeedPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, changeUserRole, getConnections, deletePost };