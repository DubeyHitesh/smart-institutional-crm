const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../models/Message');
const User = require('../models/User');
const { tenantAuth } = require('../middleware/tenantAuth');

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `voice-${Date.now()}-${Math.round(Math.random() * 1E9)}.wav`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Send a message
router.post('/send', tenantAuth, async (req, res) => {
  try {
    const { receiverId, message, replyTo } = req.body;
    const senderId = req.user._id;

    const messageData = {
      senderId,
      receiverId,
      message
    };

    if (replyTo) {
      messageData.replyTo = replyTo;
    }

    const newMessage = new req.tenantModels.Message(messageData);
    await newMessage.save();

    // Populate sender info for response
    const populatedMessage = await req.tenantModels.Message.findById(newMessage._id)
      .populate('senderId', 'name username')
      .populate('receiverId', 'name username');

    const response = {
      _id: populatedMessage._id,
      senderId: populatedMessage.senderId._id,
      receiverId: populatedMessage.receiverId._id,
      message: populatedMessage.message,
      timestamp: populatedMessage.timestamp,
      senderName: populatedMessage.senderId.name || populatedMessage.senderId.username
    };

    if (populatedMessage.replyTo) {
      response.replyTo = populatedMessage.replyTo;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get messages between current user and another user
router.get('/:userId', tenantAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await req.tenantModels.Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name username')
    .populate('receiverId', 'name username')
    .sort({ timestamp: 1 });

    // Mark messages as read
    await req.tenantModels.Message.updateMany(
      { senderId: userId, receiverId: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    const formattedMessages = messages.map(msg => {
      const formatted = {
        _id: msg._id,
        senderId: msg.senderId._id,
        receiverId: msg.receiverId._id,
        message: msg.message,
        timestamp: msg.timestamp,
        senderName: msg.senderId.name || msg.senderId.username
      };
      
      if (msg.type) {
        formatted.type = msg.type;
      }
      
      if (msg.audioUrl) {
        formatted.audioUrl = `http://localhost:5001${msg.audioUrl}`;
      }
      
      if (msg.replyTo) {
        formatted.replyTo = msg.replyTo;
      }
      
      return formatted;
    });

    res.json(formattedMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get unread message counts
router.get('/unread/counts', tenantAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    const unreadCounts = await req.tenantModels.Message.aggregate([
      { $match: { receiverId: currentUserId, isRead: false } },
      { $group: { _id: '$senderId', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'sender' } },
      { $unwind: '$sender' },
      { $project: { senderId: '$_id', count: 1, senderName: { $ifNull: ['$sender.name', '$sender.username'] } } }
    ]);
    
    res.json(unreadCounts);
  } catch (error) {
    console.error('Get unread counts error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send an audio message
router.post('/send-audio', tenantAuth, upload.single('audio'), async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    const audioUrl = `/uploads/audio/${audioFile.filename}`;

    const newMessage = new req.tenantModels.Message({
      senderId,
      receiverId,
      message: 'Voice message',
      type: 'audio',
      audioUrl
    });

    await newMessage.save();

    const populatedMessage = await req.tenantModels.Message.findById(newMessage._id)
      .populate('senderId', 'name username')
      .populate('receiverId', 'name username');

    res.status(201).json({
      _id: populatedMessage._id,
      senderId: populatedMessage.senderId._id,
      receiverId: populatedMessage.receiverId._id,
      message: populatedMessage.message,
      type: populatedMessage.type,
      audioUrl: `http://localhost:5001${populatedMessage.audioUrl}`,
      timestamp: populatedMessage.timestamp,
      senderName: populatedMessage.senderId.name || populatedMessage.senderId.username
    });
  } catch (error) {
    console.error('Send audio message error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;