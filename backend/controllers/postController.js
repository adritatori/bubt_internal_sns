const Post = require('../models/Post');
const { deleteFile } = require('../middleware/upload');
const User = require('../models/User'); 

const postController = {
  createPost: async (req, res) => {
    try {
      console.log('Create post request received:', {
        body: req.body,
        files: req.files,
        user: req.user.id
      });

      const { content, postType } = req.body;

      // Validate required fields
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // Handle file uploads
      let attachments = [];
      if (req.files && req.files.length > 0) {
        attachments = req.files.map(file => ({
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          mimetype: file.mimetype
        }));
        console.log('Processed attachments:', attachments);
      }

      // Create new post
      const newPost = new Post({
        user: req.user.id,
        content,
        postType: postType || 'regular',
        attachments: attachments.map(att => att.path) // Store only the paths
      });

      console.log('Creating new post:', newPost);

      // Save post
      const savedPost = await newPost.save();

      // Populate user info
      await savedPost.populate('user', 'name profileImage role');

      console.log('Post created successfully:', savedPost);

      res.json(savedPost);
    } catch (err) {
      console.error('Create post error:', err);
      
      // Delete uploaded files if there was an error
      if (req.files) {
        for (const file of req.files) {
          await deleteFile(file.filename);
        }
      }

      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
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
      // Get current user's following list
      const currentUser = await User.findById(req.user.id);
      const following = currentUser.following;
      
      // Get posts from followed users and the user's own posts
      const posts = await Post.find({
        $or: [
          { user: { $in: [...following, req.user.id] } }, // Posts from followed users and self
        ]
      })
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'profileImage', 'role'])
        .populate({
          path: 'comments.user',
          select: 'name profileImage role'
        })
        .populate({
          path: 'likes',
          select: 'name profileImage'
        });

      res.json(posts);
    } catch (err) {
      console.error('Get posts error:', err);
      res.status(500).send('Server Error');
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'profileImage', 'role'])
        .populate({
          path: 'comments.user',
          select: 'name profileImage role'
        })
        .populate({
          path: 'likes',
          select: 'name profileImage'
        });

      res.json(posts);
    } catch (err) {
      console.error('Get user posts error:', err);
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
      const isLiked = post.likes.includes(req.user.id);

      if (isLiked) {
        // Remove like
        post.likes = post.likes.filter(like => like.toString() !== req.user.id);
      } else {
        // Add like
        post.likes.push(req.user.id);

        // Create notification if the post is not from the current user
        if (post.user.toString() !== req.user.id) {
          const postUser = await User.findById(post.user);
          postUser.notifications.unshift({
            type: 'like',
            fromUser: req.user.id,
            post: post._id,
            read: false
          });
          await postUser.save();
        }
      }

      await post.save();
      
      // Populate the likes before sending response
      await post.populate('likes', 'name profileImage');
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
        content: req.body.content,
        date: Date.now()
      };

      post.comments.unshift(newComment);
      await post.save();

      // Create notification if the comment is not from the post owner
      if (post.user.toString() !== req.user.id) {
        const postUser = await User.findById(post.user);
        postUser.notifications.unshift({
          type: 'comment',
          fromUser: req.user.id,
          post: post._id,
          read: false
        });
        await postUser.save();
      }

      // Populate the new comment with user info
      await post.populate('comments.user', 'name profileImage');
      res.json(post.comments);
    } catch (err) {
      console.error('Comment post error:', err);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = postController;