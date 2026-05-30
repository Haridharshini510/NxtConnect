const Job = require('../models/Job');
const { sanitizeText, sanitizeStringArray } = require('../utils/sanitize');

// @desc  Get all jobs (with filters)
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { industry, type, referral, search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (type) filter.type = type;
    if (referral === 'true') filter.isReferralAvailable = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name profilePhoto industry')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create a job posting (mentor only)
// @route POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { company, title, location, type, description, requirements, isReferralAvailable, applicationUrl, deadline, industry, skills } = req.body;
    const job = await Job.create({
      postedBy: req.user._id,
      company: sanitizeText(company, { maxLen: 120 }),
      title: sanitizeText(title, { maxLen: 140 }),
      location: sanitizeText(location, { maxLen: 120 }),
      type,
      description: sanitizeText(description, { maxLen: 4000 }),
      requirements: sanitizeStringArray(requirements, { maxItems: 30, maxLen: 200 }),
      isReferralAvailable: isReferralAvailable || false,
      applicationUrl: sanitizeText(applicationUrl, { maxLen: 300 }),
      deadline,
      industry: sanitizeText(industry, { maxLen: 80 }),
      skills: sanitizeStringArray(skills, { maxItems: 30, maxLen: 50 }),
    });
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update a job posting
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = {};
    if (req.body.company !== undefined) updates.company = sanitizeText(req.body.company, { maxLen: 120 });
    if (req.body.title !== undefined) updates.title = sanitizeText(req.body.title, { maxLen: 140 });
    if (req.body.location !== undefined) updates.location = sanitizeText(req.body.location, { maxLen: 120 });
    if (req.body.type !== undefined) updates.type = req.body.type;
    if (req.body.description !== undefined) updates.description = sanitizeText(req.body.description, { maxLen: 4000 });
    if (req.body.requirements !== undefined) updates.requirements = sanitizeStringArray(req.body.requirements, { maxItems: 30, maxLen: 200 });
    if (req.body.isReferralAvailable !== undefined) updates.isReferralAvailable = req.body.isReferralAvailable;
    if (req.body.applicationUrl !== undefined) updates.applicationUrl = sanitizeText(req.body.applicationUrl, { maxLen: 300 });
    if (req.body.deadline !== undefined) updates.deadline = req.body.deadline;
    if (req.body.industry !== undefined) updates.industry = sanitizeText(req.body.industry, { maxLen: 80 });
    if (req.body.skills !== undefined) updates.skills = sanitizeStringArray(req.body.skills, { maxItems: 30, maxLen: 50 });

    const updated = await Job.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ job: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete a job posting
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };
