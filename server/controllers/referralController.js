const Referral = require('../models/Referral');
const Connection = require('../models/Connection');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// @desc  Student requests a referral from a mentor
// @route POST /api/referrals
const requestReferral = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { mentorId, jobTitle, company, jobUrl, message } = req.body;
    const studentId = req.user._id;

    // Must have an active connection with this mentor
    const connection = await Connection.findOne({ studentId, mentorId, status: 'active' });
    if (!connection) {
      return res.status(400).json({ message: 'You need an active mentorship connection to request a referral.' });
    }

    // Check duplicate
    const existing = await Referral.findOne({ studentId, mentorId, company });
    if (existing) {
      return res.status(400).json({ message: 'You already have a referral request for this company with this mentor.' });
    }

    const referral = await Referral.create({
      studentId, mentorId,
      connectionId: connection._id,
      jobTitle, company,
      jobUrl: jobUrl || '',
      message: message || '',
      // Legacy aliases for compatibility with old notifications/indexes.
      referredBy: mentorId,
      referredTo: studentId,
    });

    // Notify mentor
    const mentor = await User.findById(mentorId);
    await createNotification(io, {
      userId: mentorId,
      type: 'connection_request', // reusing type
      title: 'Referral request received',
      body: `${req.user.name} is asking for a referral at ${company} for the ${jobTitle} role.`,
      link: '/referrals',
      fromUser: studentId,
      meta: { referralId: referral._id },
    });

    res.status(201).json({ referral });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already have a referral request for this company with this mentor.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get referrals (student: own requests, mentor: incoming requests)
// @route GET /api/referrals
const getReferrals = async (req, res) => {
  try {
    const filter = req.user.role === 'mentor'
      ? { mentorId: req.user._id }
      : { studentId: req.user._id };

    const referrals = await Referral.find(filter)
      .populate('studentId', 'name email profilePhoto college')
      .populate('mentorId', 'name email profilePhoto industry')
      .sort({ createdAt: -1 });

    res.json({ referrals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Mentor responds to a referral request
// @route PUT /api/referrals/:id/respond
const respondToReferral = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { status, mentorNote } = req.body; // status: 'approved' | 'declined' | 'referred'

    if (!['approved', 'declined', 'referred'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });

    if (referral.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    referral.status = status;
    referral.mentorNote = mentorNote || '';
    if (status === 'referred') referral.referredAt = new Date();
    await referral.save();

    // Notify student
    const notifMessages = {
      approved: { title: '🎉 Referral approved!', body: `${req.user.name} will refer you at ${referral.company}. Check your messages.` },
      declined: { title: 'Referral request declined', body: `${req.user.name} couldn't refer you at ${referral.company} at this time.` },
      referred: { title: "🚀 You've been referred!", body: `${req.user.name} has submitted a referral for you at ${referral.company}.` },
    };

    const msg = notifMessages[status];
    await createNotification(io, {
      userId: referral.studentId,
      type: 'connection_accepted',
      title: msg.title,
      body: msg.body,
      link: '/referrals',
      fromUser: req.user._id,
      meta: { referralId: referral._id },
    });

    res.json({ referral });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete a referral request (student only, if pending)
// @route DELETE /api/referrals/:id
const deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Not found' });
    if (referral.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (referral.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending requests' });
    }
    await referral.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requestReferral, getReferrals, respondToReferral, deleteReferral };
