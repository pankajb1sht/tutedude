const express = require('express');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

// Send friend request
router.post('/request', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    if (targetUser.friends.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    const alreadySent = targetUser.friendRequests.find(
      req => req.from.toString() === req.user._id.toString()
    );
    if (alreadySent) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add request
    targetUser.friendRequests.push({
      from: req.user._id,
      status: 'pending'
    });

    await targetUser.save();
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.log('Send request error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Accept friend request
router.post('/accept', auth, async (req, res) => {
  try {
    const { requestId } = req.body;

    // Find request
    const request = req.user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already handled' });
    }

    // Update request
    request.status = 'accepted';

    // Add as friends
    req.user.friends.push(request.from);
    const otherUser = await User.findById(request.from);
    otherUser.friends.push(req.user._id);

    // Save both users
    await req.user.save();
    await otherUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.log('Accept request error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Reject friend request
router.post('/reject', auth, async (req, res) => {
  try {
    const { requestId } = req.body;

    // Find request
    const request = req.user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already handled' });
    }

    // Update request
    request.status = 'rejected';
    await req.user.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.log('Reject request error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Remove friend
router.delete('/remove/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    // Remove from both users
    req.user.friends = req.user.friends.filter(id => id.toString() !== friendId);
    const otherUser = await User.findById(friendId);
    
    if (otherUser) {
      otherUser.friends = otherUser.friends.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await otherUser.save();
    }

    await req.user.save();
    res.json({ message: 'Friend removed' });
  } catch (error) {
    console.log('Remove friend error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.from', 'username email');

    const pendingRequests = user.friendRequests.filter(
      req => req.status === 'pending'
    );

    res.json(pendingRequests);
  } catch (error) {
    console.log('Get requests error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get friends list
router.get('/list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username email');

    res.json(user.friends);
  } catch (error) {
    console.log('Get friends error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router; 