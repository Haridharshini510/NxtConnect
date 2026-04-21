const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const feedPostSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    type: {
      type: String,
      enum: ['story', 'tip', 'opportunity', 'achievement', 'question'],
      default: 'story',
    },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    isPublished: { type: Boolean, default: true },
    college: { type: String, default: '' }, // for alumni college-filtering
  },
  { timestamps: true }
);

feedPostSchema.index({ createdAt: -1 });
feedPostSchema.index({ authorId: 1 });

module.exports = mongoose.model('FeedPost', feedPostSchema);