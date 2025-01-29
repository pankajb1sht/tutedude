require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGODB_URI = process.env.MONGODB_URI;

const generateUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    // await User.deleteMany({});

    const users = [];
    for (let i = 1; i <= 100; i++) {
      users.push({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: 'password123', // This will be hashed by the User model
      });
    }

    await User.insertMany(users);
    console.log('Successfully created 100 sample users');
    process.exit(0);
  } catch (error) {
    console.error('Error generating users:', error);
    process.exit(1);
  }
};

generateUsers(); 