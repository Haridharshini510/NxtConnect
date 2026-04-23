// server/controllers/aiMatchController.js
// Replaces /api/mentors/matched with AI-powered Mistral matching

const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const { scoreMentorForStudent } = require('../services/aiService');

// Simple weighted fallback (used when AI quota exceeded or fails for a mentor)
const fallbackScore = (student, mentorUser, mentorProfile) => {
  const studentSkills = Array.isArray(student.skills) ? student.skills : [];
  const mentorSkillsRaw = Array.isArray(mentorUser.skills) ? mentorUser.skills : [];
  const goalsRaw = Array.isArray(student.careerGoals) ? student.careerGoals : [];
  const expertiseRaw = Array.isArray(mentorProfile.expertise) ? mentorProfile.expertise : [];

  let score = 0;
  if (student.industry && mentorUser.industry &&
      student.industry.toLowerCase() === mentorUser.industry.toLowerCase()) score += 40;

  const studentSkillsLower = studentSkills.map((s) => String(s).toLowerCase());
  const mentorSkills = mentorSkillsRaw.map((s) => String(s).toLowerCase());
  const skillOverlap = studentSkillsLower.filter((s) => mentorSkills.includes(s));
  score += Math.min((skillOverlap.length / Math.max(studentSkillsLower.length, 1)) * 35, 35);

  const goals = goalsRaw.map((g) => String(g).toLowerCase());
  const expertise = expertiseRaw.map((e) => String(e).toLowerCase());
  const goalOverlap = goals.filter((g) => expertise.some((e) => e.includes(g) || g.includes(e)));
  score += Math.min((goalOverlap.length / Math.max(goals.length, 1)) * 25, 25);

  return { score: Math.round(score), reason: 'Matched by skills and industry alignment' };
};

// @desc  Get AI-matched mentors for the logged-in student
// @route GET /api/ai/matched-mentors
const getAIMatchedMentors = async (req, res) => {
  try {
    const student = req.user;

    // Fetch all available mentor profiles
    const profiles = await MentorProfile.find({
      isAvailable: true,
      $expr: { $lt: ['$currentMenteesCount', '$maxMentees'] },
    }).populate('userId', '-passwordHash');

    const availableProfiles = profiles.filter(
      (p) => p.userId && p.userId.isActive && p.currentMenteesCount < p.maxMentees
    );

    if (availableProfiles.length === 0) {
      return res.json({ mentors: [], aiPowered: false });
    }

    // Determine how many to run through AI vs fallback
    // HF free tier allows ~30 req/min, so batch top 10 with AI, rest with fallback
    const AI_BATCH_SIZE = 10;
    const toScore = availableProfiles.slice(0, AI_BATCH_SIZE);
    const remaining = availableProfiles.slice(AI_BATCH_SIZE);

    // Run AI scoring in parallel for first batch
    const aiScored = await Promise.all(
      toScore.map(async (profile) => {
        try {
          const { score, reason } = await scoreMentorForStudent(student, profile.userId, profile);
          return { ...profile.toObject(), matchScore: score, matchReason: reason, aiScored: true };
        } catch {
          const { score, reason } = fallbackScore(student, profile.userId, profile);
          return { ...profile.toObject(), matchScore: score, matchReason: reason, aiScored: false };
        }
      })
    );

    // Fallback scoring for the rest
    const fallbackScored = remaining.map((profile) => {
      const { score, reason } = fallbackScore(student, profile.userId, profile);
      return { ...profile.toObject(), matchScore: score, matchReason: reason, aiScored: false };
    });

    const allScored = [...aiScored, ...fallbackScored]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    const aiPoweredCount = allScored.filter((m) => m.aiScored).length;

    res.json({
      mentors: allScored,
      aiPowered: aiPoweredCount > 0,
      aiPoweredCount,
    });
  } catch (error) {
    console.error('getAIMatchedMentors error:', error);
    res.status(500).json({ message: 'Matching failed', error: error.message });
  }
};

module.exports = { getAIMatchedMentors };
