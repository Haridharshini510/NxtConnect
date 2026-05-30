const sanitizeText = (value, { maxLen = 5000 } = {}) => {
  if (typeof value !== 'string') return value;
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
};

const sanitizeStringArray = (arr, { maxItems = 50, maxLen = 100 } = {}) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, maxItems)
    .map((item) => sanitizeText(item, { maxLen }))
    .filter((item) => typeof item === 'string' && item.length > 0);
};

module.exports = { sanitizeText, sanitizeStringArray };

