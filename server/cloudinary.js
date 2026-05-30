const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'nextconnect',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });
const uploadProfilePhoto = multer({ storage });
const uploadResume = multer({ storage });

const uploadBufferToCloudinary = async ({ buffer, folder, publicId, resourceType = 'image', format, options = {} }) => {
  const mimePrefix = resourceType === 'raw' ? 'application/octet-stream' : 'image/jpeg';
  const dataUri = `data:${mimePrefix};base64,${buffer.toString('base64')}`;
  return cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    resource_type: resourceType,
    format,
    ...options,
  });
};

module.exports = { cloudinary, upload, uploadProfilePhoto, uploadResume, uploadBufferToCloudinary };
