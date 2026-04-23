const Application = require('../models/Application');

// @desc  Get all applications for current user
// @route GET /api/applications
const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('referralId', 'company jobTitle status')
      .sort({ updatedAt: -1 });

    // Group by status for kanban
    const grouped = {
      saved: [],
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
      withdrawn: [],
    };
    applications.forEach((app) => {
      if (grouped[app.status]) grouped[app.status].push(app);
    });

    res.json({ applications, grouped, total: applications.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create application
// @route POST /api/applications
const createApplication = async (req, res) => {
  try {
    const { company, role, jobUrl, location, type, status, appliedDate, salary, notes, priority, source, referralId } = req.body;
    const app = await Application.create({
      userId: req.user._id,
      company, role,
      jobUrl: jobUrl || '',
      location: location || '',
      type: type || 'full-time',
      status: status || 'saved',
      appliedDate: appliedDate || null,
      salary: salary || '',
      notes: notes || '',
      priority: priority || 'medium',
      source: source || '',
      referralId: referralId || null,
    });
    res.status(201).json({ application: app });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update application (status change, notes, etc.)
// @route PUT /api/applications/:id
const updateApplication = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, userId: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });

    const allowed = ['company', 'role', 'jobUrl', 'location', 'type', 'status', 'appliedDate', 'interviewDate', 'salary', 'notes', 'contacts', 'priority', 'source'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) app[f] = req.body[f]; });
    await app.save();

    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete application
// @route DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get stats summary
// @route GET /api/applications/stats
const getStats = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id });
    const stats = {
      total: apps.length,
      saved: apps.filter((a) => a.status === 'saved').length,
      applied: apps.filter((a) => a.status === 'applied').length,
      interview: apps.filter((a) => a.status === 'interview').length,
      offer: apps.filter((a) => a.status === 'offer').length,
      rejected: apps.filter((a) => a.status === 'rejected').length,
      responseRate: apps.length > 0
        ? Math.round(((apps.filter((a) => ['interview', 'offer'].includes(a.status)).length) / Math.max(apps.filter((a) => a.status !== 'saved').length, 1)) * 100)
        : 0,
    };
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApplications, createApplication, updateApplication, deleteApplication, getStats };