const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('Register error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router; 