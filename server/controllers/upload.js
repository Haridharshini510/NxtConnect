const User = require('../models/User');
const { uploadBufferToCloudinary } = require('../cloudinary');
const { recordUploadEvent } = require('../middleware/uploadSecurity');

// POST /api/upload/resume
// Multer + Cloudinary handles the upload; this just saves the URL to the user
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const uploaded = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: 'nextconnect/resumes',
      publicId: `resume_${req.user._id}_${Date.now()}`,
      resourceType: 'raw',
      format: 'pdf',
      options: { type: 'private' },
    });
    const resumeUrl = uploaded.secure_url;
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });
    await recordUploadEvent({ userId: req.user._id, kind: 'resume_pdf', bytes: req.file.size || req.file.buffer.length });

    res.json({ success: true, message: 'Resume uploaded!', resumeUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/upload/profile-photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const uploaded = await uploadBufferToCloudinary({
      buffer: req.file.buffer,
      folder: 'nextconnect/profile-photos',
      publicId: `profile_${req.user._id}_${Date.now()}`,
      resourceType: 'image',
    });
    const profilePhoto = uploaded.secure_url;
    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto }, { new: true });
    await recordUploadEvent({ userId: req.user._id, kind: 'profile_photo', bytes: req.file.size || req.file.buffer.length });

    res.json({ success: true, message: 'Photo uploaded!', profilePhoto, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadResume, uploadProfilePhoto };
