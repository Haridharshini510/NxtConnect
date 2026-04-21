const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Connection',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: [600],
      default: '',
    },
    tags: [
      {
        type: String,
        enum: ['helpful', 'knowledgeable', 'responsive', 'encouraging', 'practical', 'patient'],
      },
    ],
  },
  { timestamps: true }
);

// One rating per student per connection
ratingSchema.index({ connection: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);