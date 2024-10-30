const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const postController = require('../controllers/postController');

// Get all posts
router.get('/', auth, postController.getPosts);

// Create a post
router.post('/', [auth, upload.array('attachments', 5)], postController.createPost);

// Like a post
router.put('/:id/like', auth, postController.likePost);

// Comment on a post
router.post('/:id/comment', auth, postController.commentPost);

// Delete a post
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
