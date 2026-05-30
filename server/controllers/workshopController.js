const Workshop = require('../models/Workshop');
const { createNotification } = require('../services/notificationService');
const { sendWorkshopRegistrationEmail } = require('../services/emailService');
const { sanitizeText, sanitizeStringArray } = require('../utils/sanitize');

// @desc  Get all published workshops
// @route GET /api/workshops
const getWorkshops = async (req, res) => {
  try {
    const { type, upcoming, category } = req.query;
    const filter = { isPublished: true };
    if (type) filter.type = type;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (upcoming === 'true') filter.scheduledAt = { $gte: new Date() };

    const workshops = await Workshop.find(filter)
      .populate('hostId', 'name profilePhoto industry')
      .sort({ scheduledAt: 1 });

    res.json({ workshops });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get single workshop
// @route GET /api/workshops/:id
const getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('hostId', 'name profilePhoto industry bio')
      .populate('attendees', 'name profilePhoto');
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json({ workshop });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create a workshop (mentor/admin only)
// @route POST /api/workshops
const createWorkshop = async (req, res) => {
  try {
    const { title, description, type, category, scheduledAt, durationMinutes, meetingLink, maxCapacity, tags, isPaid, price } = req.body;
    const workshop = await Workshop.create({
      hostId: req.user._id,
      title: sanitizeText(title, { maxLen: 150 }),
      description: sanitizeText(description, { maxLen: 5000 }),
      type,
      category: sanitizeText(category, { maxLen: 100 }),
      scheduledAt,
      durationMinutes: durationMinutes || 60,
      meetingLink: sanitizeText(meetingLink, { maxLen: 300 }),
      maxCapacity: maxCapacity || 100,
      tags: sanitizeStringArray(tags, { maxItems: 20, maxLen: 40 }),
      isPaid: isPaid || false,
      price: price || 0,
    });
    res.status(201).json({ workshop });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Register for a workshop
// @route POST /api/workshops/:id/register
const registerForWorkshop = async (req, res) => {
  try {
    const io = req.app.get('io');
    const workshop = await Workshop.findById(req.params.id).populate('hostId', 'name');
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    if (workshop.hostId?._id?.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot register for your own event' });
    }

    const alreadyRegistered = workshop.attendees.includes(req.user._id);
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });

    if (workshop.attendees.length >= workshop.maxCapacity) {
      return res.status(400).json({ message: 'Workshop is full' });
    }

    workshop.attendees.push(req.user._id);
    await workshop.save();

    // In-app notification
    await createNotification(io, {
      userId: req.user._id,
      type: 'event_registered',
      title: 'Workshop Registration Confirmed',
      body: `You're registered for "${workshop.title}"`,
      link: `/workshops/${workshop._id}`,
      meta: { workshopId: workshop._id },
    });

    // Email
    sendWorkshopRegistrationEmail({
      toEmail: req.user.email,
      toName: req.user.name,
      workshopTitle: workshop.title,
      scheduledAt: workshop.scheduledAt,
      meetingLink: workshop.meetingLink,
    });

    res.json({ message: 'Registered successfully', workshop });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Unregister from a workshop
// @route DELETE /api/workshops/:id/register
const unregisterFromWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    workshop.attendees = workshop.attendees.filter(
      (a) => a.toString() !== req.user._id.toString()
    );
    await workshop.save();
    res.json({ message: 'Unregistered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update workshop (host or admin)
// @route PUT /api/workshops/:id
const updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Not found' });
    if (workshop.hostId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = {};
    if (req.body.title !== undefined) updates.title = sanitizeText(req.body.title, { maxLen: 150 });
    if (req.body.description !== undefined) updates.description = sanitizeText(req.body.description, { maxLen: 5000 });
    if (req.body.type !== undefined) updates.type = req.body.type;
    if (req.body.category !== undefined) updates.category = sanitizeText(req.body.category, { maxLen: 100 });
    if (req.body.scheduledAt !== undefined) updates.scheduledAt = req.body.scheduledAt;
    if (req.body.durationMinutes !== undefined) updates.durationMinutes = req.body.durationMinutes;
    if (req.body.meetingLink !== undefined) updates.meetingLink = sanitizeText(req.body.meetingLink, { maxLen: 300 });
    if (req.body.recordingUrl !== undefined) updates.recordingUrl = sanitizeText(req.body.recordingUrl, { maxLen: 300 });
    if (req.body.maxCapacity !== undefined) updates.maxCapacity = req.body.maxCapacity;
    if (req.body.tags !== undefined) updates.tags = sanitizeStringArray(req.body.tags, { maxItems: 20, maxLen: 40 });
    if (req.body.isPaid !== undefined) updates.isPaid = req.body.isPaid;
    if (req.body.price !== undefined) updates.price = req.body.price;

    const updated = await Workshop.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ workshop: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete workshop
// @route DELETE /api/workshops/:id
const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Not found' });
    if (workshop.hostId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await workshop.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWorkshops, getWorkshopById, createWorkshop, registerForWorkshop, unregisterFromWorkshop, updateWorkshop, deleteWorkshop };
