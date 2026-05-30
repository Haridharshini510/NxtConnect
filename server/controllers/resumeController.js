const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const { uploadBufferToCloudinary, cloudinary } = require('../cloudinary');
const { analyzeResume, analyzeResumeText, generateExperienceBullet } = require('../services/aiService');
const { recordUploadEvent } = require('../middleware/uploadSecurity');

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

    const hasPdfText = Boolean(resume.uploadedResume?.extractedText?.trim());
    const hasFormContent = Boolean(resume.summary || resume.experience?.length > 0 || resume.skills?.length > 0);
    const hasContent = hasPdfText || hasFormContent;
    if (!hasContent) {
      return res.status(400).json({ message: 'Upload a resume PDF or add content in the form before analyzing.' });
    }

    const source = hasPdfText ? 'pdf' : 'form';
    const analysis = hasPdfText
      ? await analyzeResumeText(resume.uploadedResume.extractedText)
      : await analyzeResume(resume.toObject());

    // Cache the analysis on the resume document
    resume.aiAnalysis = { ...analysis, source, analyzedAt: new Date() };
    await resume.save();

    res.json({ analysis: resume.aiAnalysis });
  } catch (err) {
    console.error('analyzeMyResume error:', err);
    res.status(500).json({ message: err.message || 'AI analysis failed' });
  }
};

// @desc  Upload resume PDF, save URL + extracted text on resume
// @route POST /api/resume/upload
const uploadMyResumePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const parsed = await pdfParse(req.file.buffer);
    const extractedText = (parsed?.text || '').trim();
    if (!extractedText) {
      return res.status(400).json({ message: 'Could not extract text from this PDF. Please try a text-based PDF.' });
    }

    const publicId = `resume_${req.user._id}_${Date.now()}`;
    const uploaded = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: 'nextconnect/resumes',
      publicId,
      resourceType: 'raw',
      format: 'pdf',
      options: {
        type: 'private',
      },
    });

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user._id },
      {
        uploadedResume: {
          url: uploaded.secure_url,
          publicId,
          fileName: req.file.originalname,
          extractedText,
          uploadedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    await recordUploadEvent({ userId: req.user._id, kind: 'resume_pdf', bytes: req.file.size || req.file.buffer.length });
    res.json({ resume });
  } catch (err) {
    console.error('uploadMyResumePdf error:', err);
    res.status(500).json({ message: err.message || 'Failed to upload resume PDF' });
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

// @desc  Get signed URL for uploaded resume PDF
// @route GET /api/resume/uploaded-url
const getUploadedResumeUrl = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    const publicId = resume?.uploadedResume?.publicId;
    if (!publicId) return res.status(404).json({ message: 'No uploaded resume found' });

    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 5;
    const signedUrl = cloudinary.utils.private_download_url(
      publicId,
      'pdf',
      { resource_type: 'raw', type: 'private', expires_at: expiresAt, attachment: true }
    );

    res.json({ url: signedUrl, fileName: resume.uploadedResume.fileName || 'resume.pdf' });
  } catch (err) {
    console.error('getUploadedResumeUrl error:', err);
    res.status(500).json({ message: 'Failed to create download URL' });
  }
};

module.exports = { getMyResume, saveResume, analyzeMyResume, generateBullet, uploadMyResumePdf, getUploadedResumeUrl };
