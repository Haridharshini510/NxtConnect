const Referral = require('../models/Referral');
const Job = require('../models/Job');
const User = require('../models/User');
const Connection = require('../models/Connection');
const { notifyReferral } = require('../services/notification');
const { sendReferralEmail } = require('../services/email');

// ─── POST /api/referrals ──────────────────────────────────────────────────
// Mentor refers a student to a job
const createReferral = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ success: false, message: 'Only mentors can create referrals.' });
    }

    const { jobId, studentId, note } = req.body;

    // Verify the job exists and mentor posted it (or referral is available)
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (!job.isReferralAvailable) {
      return res.status(400).json({ success: false, message: 'This job does not have referrals enabled.' });
    }

    // Verify an active connection exists between mentor and student
    const connection = await Connection.findOne({
      mentor: req.user._id,
      student: studentId,
      status: 'active',
    });
    if (!connection) {
      return res.status(403).json({ success: false, message: 'You can only refer your active mentees.' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const referral = await Referral.create({
      job: jobId,
      referredBy: req.user._id,
      referredTo: studentId,
      note,
    });

    // Notifications
    await notifyReferral(studentId, req.user._id, req.user.name, job.title, referral._id);
    await sendReferralEmail(student, req.user, job);

    await referral.populate([
      { path: 'job', select: 'title company location type' },
      { path: 'referredTo', select: 'name email profilePhoto' },
    ]);

    res.status(201).json({ success: true, message: 'Referral sent!', referral });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Student already referred to this job.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/referrals/my ────────────────────────────────────────────────
const getMyReferrals = async (req, res) => {
  try {
    const filter =
      req.user.role === 'mentor'
        ? { referredBy: req.user._id }
        : { referredTo: req.user._id };

    const referrals = await Referral.find(filter)
      .populate('job', 'title company location type isReferralAvailable')
      .populate('referredBy', 'name profilePhoto industry')
      .populate('referredTo', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json({ success: true, referrals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/referrals/:id/status ───────────────────────────────────────
// Mentor updates referral status
const updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found.' });

    if (referral.referredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    referral.status = status;
    referral.updatedByMentorAt = new Date();
    await referral.save();

    res.json({ success: true, message: 'Referral status updated.', referral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/referrals/mentees ───────────────────────────────────────────
// Mentor gets list of mentees they can refer (active connections)
const getReferrableMentees = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ success: false, message: 'Mentors only.' });
    }

    const connections = await Connection.find({ mentor: req.user._id, status: 'active' })
      .populate('student', 'name email profilePhoto skills careerGoals');

    const mentees = connections.map((c) => c.student);
    res.json({ success: true, mentees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReferral, getMyReferrals, updateReferralStatus, getReferrableMentees };