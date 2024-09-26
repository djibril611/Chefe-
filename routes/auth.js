const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // For hashing password
const User = require('../models/user'); // Assuming you have a user model
const { sendPasswordResetEmail } = require('../utils/nodemailer');

// Render password reset request form
router.get('/reset-password', (req, res) => {
    res.render('admin/resetPasswordRequest');
});

// Handle password reset request form submission
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('No account with that email found.');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Create reset link
    const resetLink = `http://${req.headers.host}/auth/reset-password/${token}`;

    // Send reset email
    await sendPasswordResetEmail(user.email, resetLink);

    res.send('Password reset link sent to your email.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing request.');
  }
});

// Render password reset form when user clicks the reset link
router.get('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    res.render('resetPasswordForm', { token: req.params.token });
  } catch (err) {
    res.status(500).send('Error retrieving user.');
  }
});

// Handle new password submission
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }, // Check token validity
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.send('Password has been reset successfully.');
  } catch (err) {
    res.status(500).send('Error resetting password.');
  }
});

module.exports = router;
