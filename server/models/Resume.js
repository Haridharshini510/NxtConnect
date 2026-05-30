const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: { type: String, default: '', maxlength: 1000 },
    experience: [
      {
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        location: { type: String, default: '' },
        duration: { type: String, default: '' }, // e.g. "Jun 2023 – Present"
        description: { type: String, default: '' },
        bullets: [{ type: String }],
        current: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        field: { type: String, default: '' },
        year: { type: String, default: '' },
        cgpa: { type: String, default: '' },
      },
    ],
    skills: [{ type: String }],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        techStack: [{ type: String }],
        link: { type: String, default: '' },
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        year: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
    uploadedResume: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      fileName: { type: String, default: '' },
      extractedText: { type: String, default: '' },
      uploadedAt: { type: Date },
    },
    // Cached AI analysis result
    aiAnalysis: {
      overallScore: { type: Number },
      atsScore: { type: Number },
      summary: { type: String },
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      missingKeywords: [{ type: String }],
      atsTips: [{ type: String }],
      analyzedAt: { type: Date },
      source: { type: String, enum: ['form', 'pdf'] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
