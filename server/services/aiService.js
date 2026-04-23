// server/services/aiService.js
// Uses Hugging Face Inference API (free tier) with Mistral-7B-Instruct

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

/**
 * Call Mistral-7B via Hugging Face Inference API.
 * Returns the generated text string.
 */
const callMistral = async (prompt, maxTokens = 512) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing HUGGINGFACE_API_KEY. Add it to your server environment.');
  }

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.3,
        top_p: 0.9,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} — ${err}`);
  }

  const data = await response.json();

  // HF returns an array of generated texts
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.trim();
  }

  throw new Error('Unexpected HuggingFace response format');
};

// ── Mentor Matching ───────────────────────────────────────────────────────────

/**
 * Use Mistral to score how well a mentor fits a student's goals.
 * Returns a score 0-100 and a short reason string.
 */
const scoreMentorForStudent = async (student, mentorUser, mentorProfile) => {
  const prompt = `<s>[INST] You are a career counselor AI. Score how well this mentor matches this student on a scale of 0 to 100.

STUDENT:
- Industry interest: ${student.industry || 'Not specified'}
- Skills: ${student.skills?.join(', ') || 'Not specified'}
- Career goals: ${student.careerGoals?.join(', ') || 'Not specified'}
- College: ${student.college || 'Not specified'}

MENTOR:
- Industry: ${mentorUser.industry || 'Not specified'}
- Current role: ${mentorProfile.jobTitle || 'Not specified'} at ${mentorProfile.currentCompany || 'Not specified'}
- Years of experience: ${mentorProfile.yearsOfExperience || 0}
- Skills: ${mentorUser.skills?.join(', ') || 'Not specified'}
- Expertise: ${mentorProfile.expertise?.join(', ') || 'Not specified'}

Respond ONLY with valid JSON in this exact format, nothing else:
{"score": <number 0-100>, "reason": "<one sentence explaining the match>"}
[/INST]`;

  try {
    const raw = await callMistral(prompt, 100);
    // Extract JSON from response (model sometimes adds extra text)
    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      reason: parsed.reason || '',
    };
  } catch (err) {
    console.error('scoreMentorForStudent error:', err.message);
    // Fallback to basic scoring if AI fails
    return { score: 0, reason: 'Score unavailable' };
  }
};

// ── Resume Analysis ───────────────────────────────────────────────────────────

/**
 * Analyze a resume and return structured feedback.
 */
const analyzeResume = async (resumeData) => {
  const resumeText = `
Name: ${resumeData.personalInfo?.name || ''}
Summary: ${resumeData.summary || ''}
Experience: ${resumeData.experience?.map((e) => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join(' | ') || 'None'}
Education: ${resumeData.education?.map((e) => `${e.degree} from ${e.institution} (${e.year})`).join(' | ') || 'None'}
Skills: ${resumeData.skills?.join(', ') || 'None'}
Projects: ${resumeData.projects?.map((p) => `${p.name}: ${p.description}`).join(' | ') || 'None'}
  `.trim();

  const prompt = `<s>[INST] You are an expert resume reviewer helping a student or fresh graduate improve their resume for tech/business roles. Analyze this resume and give specific, actionable feedback.

RESUME:
${resumeText}

Respond ONLY with valid JSON in this exact format, nothing else:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "atsScore": <number 0-100>,
  "atsTips": ["<ATS tip 1>", "<ATS tip 2>"]
}
[/INST]`;

  try {
    const raw = await callMistral(prompt, 600);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('analyzeResume error:', err.message);
    throw new Error('AI analysis failed. Please try again in a moment.');
  }
};

/**
 * Generate a bullet point for a job experience entry.
 */
const generateExperienceBullet = async ({ role, company, task }) => {
  const prompt = `<s>[INST] Write ONE strong resume bullet point for this job experience. Use action verbs and quantify where possible. Return ONLY the bullet point text, no extra commentary.

Role: ${role}
Company: ${company}
Task/responsibility: ${task}
[/INST]`;

  try {
    const raw = await callMistral(prompt, 80);
    return raw.replace(/^[-•*]\s*/, '').trim();
  } catch (err) {
    console.error('generateExperienceBullet error:', err.message);
    throw new Error('Could not generate bullet. Try again.');
  }
};

module.exports = { scoreMentorForStudent, analyzeResume, generateExperienceBullet, callMistral };
