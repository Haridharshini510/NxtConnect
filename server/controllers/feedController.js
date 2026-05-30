const FeedPost = require('../models/Feedpost');
const { createNotification } = require('../services/notificationService');
const { sanitizeText, sanitizeStringArray } = require('../utils/sanitize');

// @desc  Get feed posts (paginated)
// @route GET /api/feed
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 15, type, college } = req.query;
    const filter = { isPublished: true };
    if (type) filter.type = type;
    if (college) filter.college = { $regex: college, $options: 'i' };

    const total = await FeedPost.countDocuments(filter);
    const posts = await FeedPost.find(filter)
      .populate('authorId', 'name profilePhoto role industry college')
      .populate('comments.authorId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create a post
// @route POST /api/feed
const createPost = async (req, res) => {
  try {
    const { content, type, tags } = req.body;
    const post = await FeedPost.create({
      authorId: req.user._id,
      content: sanitizeText(content, { maxLen: 2000 }),
      type: type || 'story',
      tags: sanitizeStringArray(tags, { maxItems: 10, maxLen: 30 }),
      college: req.user.college || '',
    });
    const populated = await post.populate('authorId', 'name profilePhoto role industry college');
    res.status(201).json({ post: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Like / unlike a post (toggle)
// @route PUT /api/feed/:id/like
const toggleLike = async (req, res) => {
  try {
    const io = req.app.get('io');
    const post = await FeedPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes = post.likes.filter((l) => l.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
      // Notify post author (not if they like their own post)
      if (post.authorId.toString() !== userId.toString()) {
        await createNotification(io, {
          userId: post.authorId,
          type: 'feed_like',
          title: 'Someone liked your post',
          body: `${req.user.name} liked your post`,
          link: '/feed',
          fromUser: userId,
          meta: { postId: post._id },
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Add a comment
// @route POST /api/feed/:id/comment
const addComment = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { content } = req.body;
    const cleanContent = sanitizeText(content, { maxLen: 500 });
    if (!cleanContent) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await FeedPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ authorId: req.user._id, content: cleanContent });
    await post.save();

    // Notify post author
    if (post.authorId.toString() !== req.user._id.toString()) {
      await createNotification(io, {
        userId: post.authorId,
        type: 'feed_comment',
        title: 'New comment on your post',
        body: `${req.user.name}: "${cleanContent.slice(0, 60)}${cleanContent.length > 60 ? '...' : ''}"`,
        link: '/feed',
        fromUser: req.user._id,
        meta: { postId: post._id },
      });
    }

    const updated = await FeedPost.findById(post._id)
      .populate('authorId', 'name profilePhoto role industry college')
      .populate('comments.authorId', 'name profilePhoto');

    res.status(201).json({ post: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Delete a post (own or admin)
// @route DELETE /api/feed/:id
const deletePost = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFeed, createPost, toggleLike, addComment, deletePost };
