const express = require('express');
const router = express.Router();
const { getFeed, createPost, toggleLike, addComment, deletePost } = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFeed);
router.post('/', protect, createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

module.exports = router;