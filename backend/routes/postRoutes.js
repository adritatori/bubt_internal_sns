const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const postController = require('../controllers/postController');
const feedController = require('../controllers/feedController'); // Import feedController

// Get all posts
router.get('/', auth, postController.getPosts);

// Get user-specific posts
router.get('/user/:userId', auth, postController.getUserPosts);

// Create post
router.post('/', [
  auth,
  upload.array('attachments', 5)
], postController.createPost);

// Like post
router.put('/:id/like', auth, postController.likePost);

// Comment on post
router.post('/:id/comment', auth, postController.commentPost);

// Delete post
router.delete('/:id', auth, postController.deletePost);

// Feed route
router.get('/feed', auth, feedController.getFeed); // Add the feed route

module.exports = router;