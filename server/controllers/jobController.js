const Job = require('../models/Job');

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
      company, title, location, type, description,
      requirements: requirements || [],
      isReferralAvailable: isReferralAvailable || false,
      applicationUrl, deadline, industry,
      skills: skills || [],
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

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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