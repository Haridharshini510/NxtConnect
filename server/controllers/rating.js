const Rating = require('../models/Rating');
const MentorProfile = require('../models/MentorProfile');
const Connection = require('../models/Connection.model');
const { notifyRatingReceived } = require('../services/notification');

// ─── POST /api/ratings ────────────────────────────────────────────────────
const submitRating = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can submit ratings.' });
    }

    const { mentorId, connectionId, score, review, tags } = req.body;

    // Verify the connection exists and belongs to this student
    const connection = await Connection.findOne({
      _id: connectionId,
      student: req.user._id,
      mentor: mentorId,
      status: { $in: ['active', 'closed'] },
    });
    if (!connection) {
      return res.status(403).json({ success: false, message: 'No valid connection found with this mentor.' });
    }

    const rating = await Rating.create({
      mentor: mentorId,
      student: req.user._id,
      connection: connectionId,
      score,
      review,
      tags,
    });

    // Recalculate mentor's average rating
    const allRatings = await Rating.find({ mentor: mentorId });
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

    await MentorProfile.findOneAndUpdate(
      { userId: mentorId },
      { 'rating.average': parseFloat(avg.toFixed(1)), 'rating.count': allRatings.length }
    );

    // Notify the mentor
    await notifyRatingReceived(mentorId, req.user.name, score);

    res.status(201).json({ success: true, message: 'Rating submitted. Thank you!', rating });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already rated this connection.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/ratings/mentor/:mentorId ───────────────────────────────────
const getMentorRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ mentor: req.params.mentorId })
      .populate('student', 'name profilePhoto college')
      .sort({ createdAt: -1 });

    const mentorProfile = await MentorProfile.findOne({ userId: req.params.mentorId }).select('rating');

    res.json({ success: true, ratings, summary: mentorProfile?.rating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/ratings/check/:connectionId ────────────────────────────────
// Check if student already rated a connection
const checkRating = async (req, res) => {
  try {
    const existing = await Rating.findOne({
      connection: req.params.connectionId,
      student: req.user._id,
    });
    res.json({ success: true, hasRated: !!existing, rating: existing || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitRating, getMentorRatings, checkRating };