// server/controllers/connectionController.js — PHASE 2 REPLACEMENT
// Replaces the Phase 1 version. Adds in-app notifications and email on request/accept.

const Connection = require('../models/Connection');
const ChatRoom = require('../models/ChatRoom');
const MentorProfile = require('../models/MentorProfile');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { sendConnectionRequestEmail, sendConnectionAcceptedEmail } = require('../services/emailService');
const { sanitizeText } = require('../utils/sanitize');

const requestConnection = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { mentorId, requestMessage } = req.body;
    const studentId = req.user._id;

    if (mentorId === studentId.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const existing = await Connection.findOne({ studentId, mentorId });
    if (existing) return res.status(400).json({ message: 'Connection request already exists' });

    const mentorProfile = await MentorProfile.findOne({ userId: mentorId });
    if (!mentorProfile) return res.status(404).json({ message: 'Mentor not found' });
    if (!mentorProfile.isAvailable) return res.status(400).json({ message: 'Mentor is not available' });
    if (mentorProfile.currentMenteesCount >= mentorProfile.maxMentees) {
      return res.status(400).json({ message: 'Mentor has reached their mentee limit' });
    }

    const connection = await Connection.create({
      studentId,
      mentorId,
      requestMessage: sanitizeText(requestMessage, { maxLen: 500 }),
    });

    const mentor = await User.findById(mentorId);

    // In-app notification to mentor
    await createNotification(io, {
      userId: mentorId,
      type: 'connection_request',
      title: 'New mentorship request',
      body: `${req.user.name} wants to connect with you`,
      link: '/connections',
      fromUser: studentId,
      meta: { connectionId: connection._id },
    });

    // Email to mentor
    sendConnectionRequestEmail({
      toEmail: mentor.email,
      toName: mentor.name,
      fromName: req.user.name,
    });

    res.status(201).json({ connection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptConnection = async (req, res) => {
  try {
    const io = req.app.get('io');
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ message: 'Connection not found' });

    if (connection.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the mentor can accept this request' });
    }
    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Connection is no longer pending' });
    }

    const chatRoom = await ChatRoom.create({
      connectionId: connection._id,
      participants: [connection.studentId, connection.mentorId],
      messages: [],
    });

    connection.status = 'active';
    connection.startDate = new Date();
    connection.chatRoomId = chatRoom._id;
    await connection.save();

    await MentorProfile.findOneAndUpdate(
      { userId: connection.mentorId },
      { $inc: { currentMenteesCount: 1 } }
    );

    const student = await User.findById(connection.studentId);

    // In-app notification to student
    await createNotification(io, {
      userId: connection.studentId,
      type: 'connection_accepted',
      title: 'Mentorship request accepted! 🎉',
      body: `${req.user.name} accepted your connection request. Say hello!`,
      link: `/chat/${chatRoom._id}`,
      fromUser: req.user._id,
      meta: { connectionId: connection._id, chatRoomId: chatRoom._id },
    });

    // Email to student
    sendConnectionAcceptedEmail({
      toEmail: student.email,
      toName: student.name,
      mentorName: req.user.name,
    });

    res.json({ connection, chatRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const declineConnection = async (req, res) => {
  try {
    const io = req.app.get('io');
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ message: 'Connection not found' });

    if (connection.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the mentor can decline this request' });
    }

    connection.status = 'declined';
    await connection.save();

    // Notify student
    await createNotification(io, {
      userId: connection.studentId,
      type: 'connection_declined',
      title: 'Connection request declined',
      body: `${req.user.name} was unable to accept your request at this time.`,
      link: '/mentors',
      fromUser: req.user._id,
    });

    res.json({ connection });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const filter = role === 'mentor' ? { mentorId: userId } : { studentId: userId };

    const connections = await Connection.find(filter)
      .populate('studentId', 'name email profilePhoto college industry')
      .populate('mentorId', 'name email profilePhoto industry')
      .sort({ updatedAt: -1 });

    res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requestConnection, acceptConnection, declineConnection, getMyConnections };
