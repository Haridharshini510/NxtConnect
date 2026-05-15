const Workshop = require('../models/Workshop');
const { createNotification } = require('../services/notificationService');
const { sendWorkshopRegistrationEmail } = require('../services/emailService');

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
      title, description, type, category, scheduledAt,
      durationMinutes: durationMinutes || 60,
      meetingLink, maxCapacity: maxCapacity || 100,
      tags: tags || [],
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
    const updated = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
