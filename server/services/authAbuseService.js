const WINDOW_MS = 15 * 60 * 1000;
const CAPTCHA_THRESHOLD = Number(process.env.AUTH_CAPTCHA_THRESHOLD || 8);
const buckets = new Map();

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || 'unknown';
};

const getKey = (req, action) => `${action}:${getClientIp(req)}`;

const getBucket = (key) => {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    const fresh = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return fresh;
  }
  return current;
};

const registerFailure = (req, action) => {
  const key = getKey(req, action);
  const bucket = getBucket(key);
  bucket.count += 1;
};

const clearFailures = (req, action) => {
  const key = getKey(req, action);
  buckets.delete(key);
};

const shouldRequireCaptcha = (req, action) => {
  const key = getKey(req, action);
  const bucket = getBucket(key);
  return bucket.count >= CAPTCHA_THRESHOLD;
};

module.exports = { registerFailure, clearFailures, shouldRequireCaptcha, getClientIp };

