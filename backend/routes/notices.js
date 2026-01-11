const express = require('express');
const Notice = require('../models/Notice');
const NoticeLog = require('../models/NoticeLog');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to log notice actions
const logNoticeAction = async (action, userId, noticeId, details) => {
  try {
    await NoticeLog.create({
      action,
      noticeId,
      performedBy: userId,
      details
    });
  } catch (error) {
    console.error('Failed to log notice action:', error);
  }
};

// Get notices for current user
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const notices = await Notice.find().populate('createdBy', 'name username');
      res.json(notices);
    } else {
      const notices = await Notice.find({ 
        targetRoles: req.user.role 
      }).populate('createdBy', 'name username');
      
      // Log read action for each notice
      for (const notice of notices) {
        if (!notice.isRead.get(req.user._id.toString())) {
          await logNoticeAction('READ', req.user._id, notice._id, {
            title: notice.title,
            readBy: req.user._id
          });
        }
      }
      
      res.json(notices);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notice (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { title, content, targetRoles } = req.body;
    
    const notice = new Notice({
      title,
      content,
      createdBy: req.user._id,
      targetRoles
    });

    await notice.save();
    
    const populatedNotice = await Notice.findById(notice._id)
      .populate('createdBy', 'name username');
    
    // Log creation in both NoticeLog and ActivityLog
    await logNoticeAction('CREATE', req.user._id, notice._id, {
      title,
      content,
      targetRoles
    });
    
    // Log in ActivityLog for comprehensive tracking
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_NOTICE',
      targetType: 'notice',
      targetId: notice._id.toString(),
      details: { title, content, targetRoles },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(201).json(populatedNotice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notice (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const currentNotice = await Notice.findById(req.params.id);
    if (!currentNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    const previousData = currentNotice.toObject();
    
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name username');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Log update
    await logNoticeAction('UPDATE', req.user._id, notice._id, {
      title: notice.title,
      content: notice.content,
      targetRoles: notice.targetRoles,
      previousData
    });

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notice as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.isRead.set(req.user._id.toString(), true);
    await notice.save();

    // Log mark as read
    await logNoticeAction('MARK_READ', req.user._id, notice._id, {
      title: notice.title,
      readBy: req.user._id
    });

    res.json({ message: 'Notice marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notice (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    const noticeData = notice.toObject();
    
    await Notice.findByIdAndDelete(req.params.id);
    
    // Log deletion in both NoticeLog and ActivityLog
    await logNoticeAction('DELETE', req.user._id, req.params.id, {
      title: noticeData.title,
      content: noticeData.content,
      targetRoles: noticeData.targetRoles,
      previousData: noticeData
    });
    
    // Log in ActivityLog for comprehensive tracking
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_NOTICE',
      targetType: 'notice',
      targetId: req.params.id,
      details: { title: noticeData.title, content: noticeData.content },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;