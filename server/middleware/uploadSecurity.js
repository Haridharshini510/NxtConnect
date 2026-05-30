const UploadEvent = require('../models/UploadEvent');
const crypto = require('crypto');

const isPdfMagic = (buffer) => {
  if (!buffer || buffer.length < 5) return false;
  return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46 && buffer[4] === 0x2d; // %PDF-
};

const isJpegMagic = (buffer) => buffer?.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
const isPngMagic = (buffer) => buffer?.length > 8 &&
  buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
  buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
const isWebpMagic = (buffer) => {
  if (!buffer || buffer.length < 12) return false;
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  return riff === 'RIFF' && webp === 'WEBP';
};

const magicFileTypeGuard = (kind) => (req, res, next) => {
  if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });
  const b = req.file.buffer;

  if (kind === 'pdf' && !isPdfMagic(b)) {
    return res.status(400).json({ message: 'Invalid PDF file signature' });
  }

  if (kind === 'image' && !(isJpegMagic(b) || isPngMagic(b) || isWebpMagic(b))) {
    return res.status(400).json({ message: 'Invalid image file signature' });
  }

  return next();
};

const enforceUploadQuota = ({ kind, maxFilesPerDay, maxBytesPerDay }) => async (req, res, next) => {
  try {
    const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stats = await UploadEvent.aggregate([
      { $match: { userId: req.user._id, kind, createdAt: { $gte: dayStart } } },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalBytes: { $sum: '$bytes' },
        },
      },
    ]);

    const totalFiles = stats[0]?.totalFiles || 0;
    const totalBytes = stats[0]?.totalBytes || 0;
    const incomingBytes = req.file?.size || req.file?.buffer?.length || 0;

    if (totalFiles >= maxFilesPerDay) {
      return res.status(429).json({ message: 'Daily upload limit reached. Try again tomorrow.' });
    }

    if (totalBytes + incomingBytes > maxBytesPerDay) {
      return res.status(429).json({ message: 'Daily upload size quota exceeded. Try again tomorrow.' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to validate upload quota' });
  }
};

const optionalMalwareScan = () => async (req, res, next) => {
  const vtEnabled = String(process.env.VIRUSTOTAL_SCAN_ENABLED || '').toLowerCase() === 'true';
  const vtApiKey = (process.env.VIRUSTOTAL_API_KEY || '').trim();
  const scanUrl = process.env.MALWARE_SCAN_URL;
  if (!req.file?.buffer) return next();

  const runVirusTotalScan = async () => {
    const fileBuffer = req.file.buffer;
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const vtHeaders = { 'x-apikey': vtApiKey };

    const parseStats = (obj) => ({
      malicious: Number(obj?.malicious || 0),
      suspicious: Number(obj?.suspicious || 0),
      harmless: Number(obj?.harmless || 0),
      undetected: Number(obj?.undetected || 0),
    });

    const ensureCleanStats = (stats) => {
      if (stats.malicious > 0 || stats.suspicious > 0) {
        return false;
      }
      return true;
    };

    // Strict privacy-first mode:
    // 1) Hash lookup only.
    // 2) Never upload the file to VirusTotal.
    const existing = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}`, { headers: vtHeaders });
    if (existing.ok) {
      const existingData = await existing.json();
      const stats = parseStats(existingData?.data?.attributes?.last_analysis_stats);
      return ensureCleanStats(stats);
    }
    if (existing.status === 404) {
      // Unknown hash: allow file to preserve privacy (no cloud upload).
      return true;
    }
    if (existing.status === 429) {
      throw new Error('VirusTotal rate limited');
    }
    if (!existing.ok) {
      throw new Error(`VirusTotal lookup failed: ${existing.status}`);
    }
    return true;
  };

  try {
    if (vtEnabled && vtApiKey) {
      const isClean = await runVirusTotalScan();
      if (!isClean) {
        return res.status(400).json({ message: 'File failed security scan' });
      }
      return next();
    }

    // Fallback to custom scanner if configured.
    if (!scanUrl) return next();

    const response = await fetch(scanUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        base64: req.file.buffer.toString('base64'),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.clean === false) {
      return res.status(400).json({ message: 'File failed security scan' });
    }
    return next();
  } catch (error) {
    console.error('optionalMalwareScan error:', error.message);
    return res.status(503).json({ message: 'Upload scanner unavailable. Please try again.' });
  }
};

const recordUploadEvent = async ({ userId, kind, bytes }) => {
  await UploadEvent.create({ userId, kind, bytes });
};

module.exports = {
  magicFileTypeGuard,
  enforceUploadQuota,
  optionalMalwareScan,
  recordUploadEvent,
};
