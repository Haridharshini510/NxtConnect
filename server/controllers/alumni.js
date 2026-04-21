const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');

// ─── GET /api/alumni ──────────────────────────────────────────────────────
// Get alumni (mentors) from the same college as logged-in user
const getAlumni = async (req, res) => {
  try {
    const { college, industry, page = 1, limit = 12 } = req.query;

    // Default: same college as logged-in user
    const targetCollege = college || req.user.college;

    const userFilter = { role: 'mentor', isActive: true };
    if (targetCollege) userFilter.college = { $regex: targetCollege, $options: 'i' };
    if (industry) userFilter.industry = { $regex: industry, $options: 'i' };

    const skip = (page - 1) * limit;

    const alumni = await User.aggregate([
      { $match: userFilter },
      {
        $lookup: {
          from: 'mentorprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'mentorProfile',
        },
      },
      { $unwind: { path: '$mentorProfile', preserveNullAndEmpty: true } },
      { $project: { password: 0 } },
      { $sort: { 'mentorProfile.yearsOfExperience': -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const total = await User.countDocuments(userFilter);

    res.json({
      success: true,
      alumni,
      targetCollege,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/alumni/colleges ─────────────────────────────────────────────
// Get list of all colleges represented on the platform (for filter dropdown)
const getAllColleges = async (req, res) => {
  try {
    const colleges = await User.distinct('college', {
      college: { $ne: '' },
      role: 'mentor',
      isActive: true,
    });
    res.json({ success: true, colleges: colleges.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/alumni/:id/journey ─────────────────────────────────────────
// Get a mentor's full career journey
const getAlumniJourney = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'mentor', isActive: true });
    if (!user) return res.status(404).json({ success: false, message: 'Alumni not found.' });

    const mentorProfile = await MentorProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      alumni: user,
      journey: mentorProfile?.careerJourney || [],
      expertise: mentorProfile?.expertise || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAlumni, getAllColleges, getAlumniJourney };