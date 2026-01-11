const express = require('express');
const { tenantAuth, adminAuth } = require('../middleware/tenantAuth');
const { logAdminActivity } = require('../middleware/activityLogger');

const router = express.Router();

// Helper function to log activity in tenant database
const logActivity = async (tenantModels, userId, action, targetType, targetId, details) => {
  try {
    await tenantModels.ActivityLog.create({
      userId,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date(),
      ipAddress: details.ipAddress,
      userAgent: details.userAgent
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Create assignment (teacher only)
router.post('/', tenantAuth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create assignments' });
    }

    const { title, description, dueDate, classId, studentIds } = req.body;
    
    // Create assignment object (stored in context state, not database)
    const assignment = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      classId,
      studentIds,
      teacherId: req.user._id,
      createdAt: new Date()
    };

    // Log assignment creation
    await logActivity(req.tenantModels, req.user._id, 'CREATE_ASSIGNMENT', 'assignment', assignment.id, {
      title,
      description,
      dueDate,
      classId,
      studentCount: studentIds?.length || 0,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;