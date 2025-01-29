const express = require('express');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

// Get all users
router.get('/all', auth, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get users except current user
    const users = await User.find({ 
      _id: { $ne: req.user._id } 
    })
      .select('username email')
      .skip(skip)
      .limit(limit);

    // Count total users
    const total = await User.countDocuments({ 
      _id: { $ne: req.user._id } 
    });

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    console.log('Get users error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user._id }
    }).select('username email');

    res.json(users);
  } catch (error) {
    console.log('Search error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    // If user has no friends, return random users
    if (!req.user.friends.length) {
      const randomUsers = await User.find({
        _id: { $ne: req.user._id }
      })
      .select('username email')
      .limit(5);
      
      return res.json(randomUsers);
    }

    // Get friends of friends
    const friendsOfFriends = [];
    for (const friendId of req.user.friends) {
      const friend = await User.findById(friendId).populate('friends');
      if (friend) {
        friendsOfFriends.push(...friend.friends);
      }
    }

    // Count occurrences
    const counts = {};
    friendsOfFriends.forEach(friend => {
      const id = friend._id.toString();
      if (id !== req.user._id.toString() && !req.user.friends.includes(id)) {
        counts[id] = (counts[id] || 0) + 1;
      }
    });

    // Sort by count and get top 5
    const topFriends = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    // Get user details
    const recommendations = await User.find({
      _id: { $in: topFriends }
    }).select('username email');

    res.json(recommendations);
  } catch (error) {
    console.log('Recommendations error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get user profile
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username email friends')
      .populate('friends', 'username email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.log('Profile error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router; 