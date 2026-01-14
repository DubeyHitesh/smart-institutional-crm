const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { tenantAuth, adminAuth } = require('../middleware/tenantAuth');
const { logAdminActivity } = require('../middleware/activityLogger');

const router = express.Router();

// Get all users (admin only)
router.get('/', tenantAuth, adminAuth, async (req, res) => {
  try {
    const users = await req.tenantModels.User.find().select('-password');
    await logAdminActivity(req.user._id, req.user.username, 'VIEW_USERS', 'USER', null, null, { count: users.length }, req);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get users for chat (teachers can see students, students can see teachers)
router.get('/chat', tenantAuth, async (req, res) => {
  try {
    let users;
    if (req.user.role === 'teacher') {
      users = await req.tenantModels.User.find({ role: 'student' }).select('-password');
    } else if (req.user.role === 'student') {
      users = await req.tenantModels.User.find({ role: 'teacher' }).select('-password');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (admin only)
router.post('/', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await req.tenantModels.User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new req.tenantModels.User({
      username,
      password: hashedPassword,
      role,
      isActive: true
    });

    await user.save();
    await logAdminActivity(req.user._id, req.user.username, 'CREATE_USER', 'USER', user._id, username, { role }, req);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { password, ...updates } = req.body;
    
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await req.tenantModels.User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logAdminActivity(req.user._id, req.user.username, 'UPDATE_USER', 'USER', user._id, user.username, updates, req);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const user = await req.tenantModels.User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await logAdminActivity(req.user._id, req.user.username, 'DELETE_USER', 'USER', user._id, user.username, { role: user.role }, req);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;