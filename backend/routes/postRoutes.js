const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload'); // Destructure upload from the exports
const postController = require('../controllers/postController');

// Get all posts
router.get('/', auth, postController.getPosts);

// Create a post with multiple file uploads
router.post('/', [
  auth,
  upload.array('attachments', 5), // Allow up to 5 files
  (err, req, res, next) => {
    if (err) {
      // Handle multer errors
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          error: 'Too many files', 
          message: 'Maximum 5 files allowed' 
        });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File too large', 
          message: 'File size should not exceed 5MB' 
        });
      }
      return res.status(400).json({ 
        error: 'Upload error', 
        message: err.message 
      });
    }
    next();
  }
], postController.createPost);

// Like a post
router.put('/:id/like', auth, postController.likePost);

// Comment on a post
router.post('/:id/comment', auth, postController.commentPost);

// Delete a post (with file cleanup)
router.delete('/:id', auth, postController.deletePost);

module.exports = router;