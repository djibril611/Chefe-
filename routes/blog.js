const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Blog List Page (display multiple posts)
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });  // Sort by newest first
    res.render('blog', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading blog list.');
  }
});

// Single Blog Post Page (display individual post)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    // Increment views
    post.views += 1;
    await post.save();

    // Fetch recent posts (limit to 5 or any number)
    const recentPosts = await BlogPost.find().sort({ createdAt: -1 }).limit(5);

    // Pass post and recentPosts to the template
    res.render('blogDetail', { post, recentPosts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading blog post.');
  }
});


// Increment likes for a blog post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    post.likes = (post.likes || 0) + 1;  // Increment likes
    await post.save();
    res.redirect('/blog/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post.');
  }
});

// Add a comment to a blog post
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    console.log('Commenting on post:', req.params.id);
    console.log('Username:', req.body.username);
    console.log('Comment:', req.body.comment);

    post.comments.push({
      username: req.body.username,
      text: req.body.comment,
      createdAt: new Date()
    });

    await post.save();
    res.redirect('/blog/' + req.params.id);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Error adding comment.');
  }
});

module.exports = router;
