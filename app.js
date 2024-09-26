const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware for parsing body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session initialization (only once)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  console.log(req.url);  // This will log each request, helping trace static file issues
  next();
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Mount routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);

// Routes for static pages
app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/menu', (req, res) => res.render('menu'));
app.get('/menu_detail', (req, res) => res.render('menu_detail'));
app.get('/contact', (req, res) => res.render('contact'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
