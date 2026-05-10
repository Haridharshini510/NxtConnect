const User = require('../models/User');

// POST /api/upload/resume
// Multer + Cloudinary handles the upload; this just saves the URL to the user
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const resumeUrl = req.file.path;
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });

    res.json({ success: true, message: 'Resume uploaded!', resumeUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/upload/profile-photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const profilePhoto = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto }, { new: true });

    res.json({ success: true, message: 'Photo uploaded!', profilePhoto, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadResume, uploadProfilePhoto };
