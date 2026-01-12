const express = require('express');
const Schedule = require('../models/Schedule');
const ScheduleLog = require('../models/ScheduleLog');
const Class = require('../models/Class');
const User = require('../models/User');
const { tenantAuth, adminAuth } = require('../middleware/tenantAuth');
const { logAdminActivity, logActivity } = require('../middleware/activityLogger');

const router = express.Router();

// Helper function to log schedule actions
const logScheduleAction = async (action, userId, scheduleData, scheduleId = null, previousData = null) => {
  try {
    await ScheduleLog.create({
      action,
      scheduleId,
      performedBy: userId,
      details: scheduleData,
      previousData
    });
  } catch (error) {
    console.error('Failed to log schedule action:', error);
  }
};

// Helper function to check time conflicts
const checkTimeConflict = (start1, end1, start2, end2) => {
  const s1 = new Date(`1970-01-01T${start1}:00`);
  const e1 = new Date(`1970-01-01T${end1}:00`);
  const s2 = new Date(`1970-01-01T${start2}:00`);
  const e2 = new Date(`1970-01-01T${end2}:00`);
  return s1 < e2 && s2 < e1;
};

// Helper function to check for conflicts
const checkScheduleConflicts = async (teacherId, classId, day, startTime, endTime, excludeId = null) => {
  const query = {
    day,
    $or: [{ teacherId }, { classId }],
    ...(excludeId && { _id: { $ne: excludeId } })
  };
  
  const existingSchedules = await Schedule.find(query);
  
  for (const schedule of existingSchedules) {
    if (checkTimeConflict(startTime, endTime, schedule.startTime, schedule.endTime)) {
      if (schedule.teacherId.toString() === teacherId.toString()) {
        return { conflict: true, type: 'teacher', schedule };
      }
      if (schedule.classId.toString() === classId.toString()) {
        return { conflict: true, type: 'class', schedule };
      }
    }
  }
  
  return { conflict: false };
};

// Get all schedules
router.get('/', tenantAuth, async (req, res) => {
  try {
    const schedules = await req.tenantModels.Schedule.find()
      .populate('classId', 'name grade')
      .populate('teacherId', 'name username');
    await logActivity(req, 'VIEW_SCHEDULES', 'SCHEDULE', null, null, { count: schedules.length });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedules for a specific class (for students)
router.get('/class/:classId', tenantAuth, async (req, res) => {
  try {
    const schedules = await req.tenantModels.Schedule.find({ classId: req.params.classId })
      .populate('teacherId', 'name username')
      .populate('classId', 'name grade')
      .sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get schedules for current teacher
router.get('/my-schedule', tenantAuth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const schedules = await req.tenantModels.Schedule.find({ teacherId: req.user._id })
      .populate('classId', 'name grade');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create weekly schedule (admin only)
router.post('/create-weekly', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { classId, teacherId, subject, weeklySchedule, academicYear } = req.body;
    
    // Validate class and teacher exist in tenant database
    const classDoc = await req.tenantModels.Class.findById(classId);
    const teacher = await req.tenantModels.User.findById(teacherId);
    
    if (!classDoc || !teacher) {
      return res.status(404).json({ message: 'Class or teacher not found' });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Selected user is not a teacher' });
    }
    
    const createdSchedules = [];
    
    // Create schedules
    for (const daySchedule of weeklySchedule) {
      const { day, startTime, endTime } = daySchedule;
      
      const schedule = new req.tenantModels.Schedule({
        classId,
        teacherId,
        subject,
        day,
        startTime,
        endTime,
        isRecurring: true,
        academicYear: academicYear || new Date().getFullYear().toString()
      });
      
      await schedule.save();
      createdSchedules.push(schedule);
    }
    
    // Log activity
    await logAdminActivity(req.user._id, req.user.username, 'CREATE_WEEKLY_SCHEDULE', 'SCHEDULE', null, subject, {
      classId,
      teacherId,
      subject,
      scheduleCount: createdSchedules.length
    }, req);
    
    res.status(201).json({ 
      message: 'Weekly schedule created successfully',
      schedules: createdSchedules 
    });
  } catch (error) {
    console.error('Error creating weekly schedule:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Create single schedule (admin only)
router.post('/', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { classId, teacherId, subject, day, startTime, endTime, academicYear } = req.body;
    
    const schedule = new req.tenantModels.Schedule({
      classId,
      teacherId,
      subject,
      day,
      startTime,
      endTime,
      academicYear: academicYear || new Date().getFullYear().toString()
    });

    await schedule.save();
    
    await logAdminActivity(req.user._id, req.user.username, 'CREATE_SCHEDULE', 'SCHEDULE', schedule._id, subject, {
      classId, teacherId, subject, day, startTime, endTime
    }, req);
    
    await logActivity(req, 'CREATE_SCHEDULE', 'SCHEDULE', schedule._id, subject, {
      classId, teacherId, day, startTime, endTime
    });
    
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update schedule (admin only)
router.put('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { teacherId, classId, day, startTime, endTime } = req.body;
    
    // Check for conflicts if time-related fields are being updated
    if (teacherId || classId || day || startTime || endTime) {
      const currentSchedule = await Schedule.findById(req.params.id);
      if (!currentSchedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      
      const conflictCheck = await checkScheduleConflicts(
        teacherId || currentSchedule.teacherId,
        classId || currentSchedule.classId,
        day || currentSchedule.day,
        startTime || currentSchedule.startTime,
        endTime || currentSchedule.endTime,
        req.params.id
      );
      
      if (conflictCheck.conflict) {
        const conflictSchedule = await Schedule.findById(conflictCheck.schedule._id)
          .populate('classId', 'name grade')
          .populate('teacherId', 'name username');
        
        return res.status(409).json({ 
          message: `Schedule conflict with ${conflictCheck.type}`,
          conflict: conflictSchedule
        });
      }
      
      // Store previous data for logging
      const previousData = currentSchedule.toObject();
      
      const schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('classId', 'name grade')
       .populate('teacherId', 'name username');

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      // Log update
      await logScheduleAction('UPDATE', req.user._id, {
        classId: schedule.classId._id,
        teacherId: schedule.teacherId._id,
        subject: schedule.subject,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        academicYear: schedule.academicYear
      }, schedule._id, previousData);
      
      await logAdminActivity(req.user._id, req.user.username, 'UPDATE_SCHEDULE', 'SCHEDULE', schedule._id, schedule.subject, req.body, req);
      
      await logActivity(req, 'UPDATE_SCHEDULE', 'SCHEDULE', schedule._id, schedule.subject, req.body);

      res.json(schedule);
    } else {
      const schedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('classId', 'name grade')
       .populate('teacherId', 'name username');

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      
      await logAdminActivity(req.user._id, req.user.username, 'UPDATE_SCHEDULE', 'SCHEDULE', schedule._id, schedule.subject, req.body, req);
      
      await logActivity(req, 'UPDATE_SCHEDULE', 'SCHEDULE', schedule._id, schedule.subject, req.body);

      res.json(schedule);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all schedules (admin only)
router.delete('/', tenantAuth, adminAuth, async (req, res) => {
  try {
    const result = await req.tenantModels.Schedule.deleteMany({});
    
    await logAdminActivity(req.user._id, req.user.username, 'DELETE_ALL_SCHEDULES', 'SCHEDULE', null, null, {
      deletedCount: result.deletedCount
    }, req);
    
    await logActivity(req, 'DELETE_ALL_SCHEDULES', 'SCHEDULE', null, null, {
      deletedCount: result.deletedCount
    });
    
    res.json({ message: `${result.deletedCount} schedules deleted successfully`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete all schedules error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete schedule (admin only)
router.delete('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const schedule = await req.tenantModels.Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Store data for logging before deletion
    const scheduleData = schedule.toObject();
    
    await req.tenantModels.Schedule.findByIdAndDelete(req.params.id);
    
    // Log deletion in ScheduleLog
    await logScheduleAction('DELETE', req.user._id, {
      classId: scheduleData.classId,
      teacherId: scheduleData.teacherId,
      subject: scheduleData.subject,
      day: scheduleData.day,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      academicYear: scheduleData.academicYear
    }, req.params.id, scheduleData);
    
    await logAdminActivity(req.user._id, req.user.username, 'DELETE_SCHEDULE', 'SCHEDULE', req.params.id, scheduleData.subject, {
      day: scheduleData.day,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime
    }, req);
    
    await logActivity(req, 'DELETE_SCHEDULE', 'SCHEDULE', req.params.id, scheduleData.subject, {
      day: scheduleData.day,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime
    });
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;