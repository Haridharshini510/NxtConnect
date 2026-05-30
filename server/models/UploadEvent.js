const mongoose = require('mongoose');

const uploadEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    kind: { type: String, enum: ['resume_pdf', 'profile_photo'], required: true, index: true },
    bytes: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

uploadEventSchema.index({ userId: 1, kind: 1, createdAt: -1 });

module.exports = mongoose.model('UploadEvent', uploadEventSchema);

