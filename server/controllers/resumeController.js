const Resume = require('../models/Resume');
const { analyzeResume, generateExperienceBullet } = require('../services/aiService');

// @desc  Get own resume (create blank if doesn't exist)
// @route GET /api/resume
const getMyResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      resume = await Resume.create({
        userId: req.user._id,
        personalInfo: {
          name: req.user.name,
          email: req.user.email,
        },
        skills: req.user.skills || [],
      });
    }
    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Save resume (full or partial update)
// @route PUT /api/resume
const saveResume = async (req, res) => {
  try {
    const allowed = ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Run AI analysis on the resume
// @route POST /api/resume/analyze
const analyzeMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found. Build your resume first.' });

    // Check resume has enough content
    const hasContent = resume.summary || resume.experience?.length > 0 || resume.skills?.length > 0;
    if (!hasContent) {
      return res.status(400).json({ message: 'Add some content to your resume before analyzing.' });
    }

    const analysis = await analyzeResume(resume.toObject());

    // Cache the analysis on the resume document
    resume.aiAnalysis = { ...analysis, analyzedAt: new Date() };
    await resume.save();

    res.json({ analysis: resume.aiAnalysis });
  } catch (err) {
    console.error('analyzeMyResume error:', err);
    res.status(500).json({ message: err.message || 'AI analysis failed' });
  }
};

// @desc  Generate a bullet point for an experience entry using AI
// @route POST /api/resume/generate-bullet
const generateBullet = async (req, res) => {
  try {
    const { role, company, task } = req.body;
    if (!role || !task) return res.status(400).json({ message: 'role and task are required' });

    const bullet = await generateExperienceBullet({ role, company: company || '', task });
    res.json({ bullet });
  } catch (err) {
    console.error('generateBullet error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate bullet' });
  }
};

module.exports = { getMyResume, saveResume, analyzeMyResume, generateBullet };