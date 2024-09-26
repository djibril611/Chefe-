const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const BlogPost = require('../models/blogPost');
const multer = require('multer');
const path = require('path');

// Set storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Name file with current timestamp
  }
});

// File filter for image types (jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .png, and .gif formats are allowed!'), false);
  }
};

// Initialize multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Admin dashboard (protected)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.render('admin/dashboard', { posts });
  } catch (err) {
    res.status(500).send('Error loading dashboard.');
  }
});

// Add GET route for Create Blog page
router.get('/create-blog', isAuthenticated, (req, res) => {
  res.render('admin/createBlog');  // Render the form to create a new blog post
});

// Create blog (protected) - POST route to handle blog submission
router.post('/create-blog', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;  // Quill's content will be in req.body.content
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = new BlogPost({
      title,
      content,  // Store the Quill HTML content in MongoDB
      image
    });
    await newPost.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating blog post.');
  }
});

// Edit blog post form (protected)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.render('admin/editBlog', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading post for editing.');
  }
});

// Handle blog post editing with image upload (protected)
router.post('/edit/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    
    const image = req.file ? `/uploads/${req.file.filename}` : post.image;

    await BlogPost.findByIdAndUpdate(req.params.id, { title, content, image });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating blog post.');
  }
});

// Delete blog post (protected)
router.get('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting blog post.');
  }
});

// Admin login page
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Handle admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'berendatech@gmail.com' && password === 'password') {
    req.session.userId = username;
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login');
});

// Admin logout route
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Image upload route for Quill
router.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }


/*
  router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
      const posts = await BlogPost.find();
      
      // Calculate total views, likes, posts, and comments
      const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
      const totalLikes = posts.reduce((acc, post) => acc + (post.likes || 0), 0);
      const totalPosts = posts.length;
      const totalComments = posts.reduce((acc, post) => acc + (post.comments.length || 0), 0);
  
      // Ensure these values are passed to the template
      res.render('admin/dashboard', {
        posts,
        totalViews,
        totalLikes,
        totalPosts,
        totalComments
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading dashboard.');
    }
  });*/


  
  
  // Return the uploaded image's URL
  res.json({
    location: `/uploads/${req.file.filename}`  // Image URL
  });
});

module.exports = router;
