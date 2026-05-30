const express = require('express');
const router = express.Router();
const { getFeed, createPost, toggleLike, addComment, deletePost } = require('../controllers/feedController');
const { protect } = require('../middleware/auth');
const { createPostValidation, addCommentValidation } = require('../middleware/validation');

router.get('/', protect, getFeed);
router.post('/', protect, createPostValidation, createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addCommentValidation, addComment);
router.delete('/:id', protect, deletePost);

module.exports = router;
