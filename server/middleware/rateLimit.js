const buckets = new Map();

const getKey = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || 'unknown';
};

const rateLimit = ({ windowMs, max, keyPrefix = 'global', message = 'Too many requests. Please try again later.' }) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${getKey(req)}`;
    const item = buckets.get(key);

    if (!item || item.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (item.count >= max) {
      const retryAfter = Math.ceil((item.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(Math.max(retryAfter, 1)));
      return res.status(429).json({ message });
    }

    item.count += 1;
    return next();
  };
};

module.exports = { rateLimit };

