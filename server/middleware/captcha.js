const { shouldRequireCaptcha, getClientIp } = require('../services/authAbuseService');

const verifyTurnstile = async (token, ip) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip || '',
  });

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await response.json();
    return Boolean(data?.success);
  } catch {
    return false;
  }
};

const captchaGuard = (action) => async (req, res, next) => {
  if (!shouldRequireCaptcha(req, action)) return next();

  const token = req.body?.captchaToken || req.headers['x-captcha-token'];
  const isValid = await verifyTurnstile(token, getClientIp(req));

  if (!isValid) {
    return res.status(400).json({
      message: 'Additional verification required. Please try again.',
      captchaRequired: true,
    });
  }

  return next();
};

module.exports = { captchaGuard };

