const Roadmap = require('../models/Roadmap');

// @desc  Get all published roadmaps
// @route GET /api/roadmaps
const getRoadmaps = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const roadmaps = await Roadmap.find(filter)
      .populate('createdBy', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get single roadmap
// @route GET /api/roadmaps/:id
const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate('createdBy', 'name profilePhoto');
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create roadmap (mentor or admin only)
// @route POST /api/roadmaps
const createRoadmap = async (req, res) => {
  try {
    const { title, category, description, steps, tags } = req.body;
    const roadmap = await Roadmap.create({
      title, category, description,
      steps: steps || [],
      tags: tags || [],
      createdBy: req.user._id,
      isPublished: true,
    });
    res.status(201).json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update roadmap
// @route PUT /api/roadmaps/:id
const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    if (roadmap.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ roadmap: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRoadmaps, getRoadmapById, createRoadmap, updateRoadmap };
