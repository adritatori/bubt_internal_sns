const Post = require('../models/Post');
const { deleteFile } = require('../middleware/upload');

const postController = {
  createPost: async (req, res) => {
    try {
      const { content } = req.body;
      
      // Handle uploaded files
      const attachments = req.files ? req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype
      })) : [];

      const newPost = new Post({
        user: req.user.id,
        content,
        attachments
      });

      const post = await newPost.save();
      await post.populate('user', ['name', 'profileImage']);
      
      res.json(post);
    } catch (err) {
      console.error('Create post error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      // Check user ownership
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      // Delete associated files
      if (post.attachments && post.attachments.length > 0) {
        for (const attachment of post.attachments) {
          if (attachment.filename) {
            await deleteFile(attachment.filename);
          }
        }
      }

      await post.remove();
      res.json({ msg: 'Post removed' });
    } catch (err) {
      console.error('Delete post error:', err);
      res.status(500).send('Server Error');
    }
  },

  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'profileImage'])
        .populate({
          path: 'comments.user',
          select: 'name profileImage'
        });
      res.json(posts);
    } catch (err) {
      console.error('Get posts error:', err);
      res.status(500).send('Server Error');
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      // Check if already liked
      if (post.likes.some(like => like.user.toString() === req.user.id)) {
        // Remove like
        post.likes = post.likes.filter(
          like => like.user.toString() !== req.user.id
        );
      } else {
        // Add like
        post.likes.unshift({ user: req.user.id });
      }

      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error('Like post error:', err);
      res.status(500).send('Server Error');
    }
  },

  commentPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
      };

      post.comments.unshift(newComment);
      await post.save();
      
      // Populate user info for the new comment
      await post.populate('comments.user', ['name', 'profileImage']);
      
      res.json(post.comments);
    } catch (err) {
      console.error('Comment post error:', err);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = postController;