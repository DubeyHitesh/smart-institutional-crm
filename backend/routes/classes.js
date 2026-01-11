const express = require('express');
const Class = require('../models/Class');
const StudentAllotmentLog = require('../models/StudentAllotmentLog');
const { tenantAuth, adminAuth } = require('../middleware/tenantAuth');
const { logAdminActivity } = require('../middleware/activityLogger');

// Helper function to log student allotment actions
const logStudentAllotment = async (action, userId, studentId, details) => {
  try {
    await StudentAllotmentLog.create({
      action,
      studentId,
      performedBy: userId,
      details
    });
  } catch (error) {
    console.error('Failed to log student allotment:', error);
  }
};

const router = express.Router();

// Get all classes
router.get('/', tenantAuth, async (req, res) => {
  try {
    const classes = await req.tenantModels.Class.find()
      .populate('teacherId', 'name username')
      .populate('studentIds', 'name username classId');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get classes for current teacher
router.get('/my-classes', tenantAuth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const classes = await req.tenantModels.Class.find({ teacherId: req.user._id })
      .populate('studentIds', 'name username classId');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create class (admin only)
router.post('/', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { name, grade, teacherId } = req.body;
    
    // Check if class with same name and grade already exists
    const existingClass = await req.tenantModels.Class.findOne({ name, grade });
    if (existingClass) {
      return res.status(400).json({ message: 'Class with this name and grade already exists' });
    }
    
    // Check if teacher is already assigned to another class
    if (teacherId) {
      const teacherAssigned = await req.tenantModels.Class.findOne({ teacherId });
      if (teacherAssigned) {
        return res.status(400).json({ message: 'Teacher is already assigned to another class' });
      }
    }
    
    const newClass = new req.tenantModels.Class({
      name,
      grade,
      teacherId: teacherId || null,
      studentIds: []
    });

    await newClass.save();
    
    // Populate teacher info before sending response
    const populatedClass = await req.tenantModels.Class.findById(newClass._id)
      .populate('teacherId', 'name username');
    
    await logAdminActivity(req.user._id, req.user.username, 'CREATE_CLASS', 'CLASS', newClass._id, name, { grade, teacherId }, req);
    res.status(201).json(populatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign teacher to class (admin only)
router.put('/:id/assign-teacher', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { teacherId } = req.body;
    
    // Check if teacher is already assigned to another class
    if (teacherId) {
      const existingClass = await req.tenantModels.Class.findOne({ 
        teacherId, 
        _id: { $ne: req.params.id } 
      });
      if (existingClass) {
        return res.status(400).json({ message: 'Teacher is already assigned to another class' });
      }
    }
    
    const updatedClass = await req.tenantModels.Class.findByIdAndUpdate(
      req.params.id,
      { teacherId },
      { new: true }
    ).populate('teacherId', 'name username');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await logAdminActivity(req.user._id, req.user.username, 'ASSIGN_TEACHER', 'CLASS', updatedClass._id, updatedClass.name, { teacherId }, req);
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add student to class (admin only)
router.put('/:id/add-student', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { studentId } = req.body;
    console.log('Adding student:', studentId, 'to class:', req.params.id);
    
    // Update class with student
    const updatedClass = await req.tenantModels.Class.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { studentIds: studentId } },
      { new: true }
    ).populate('studentIds', 'name username')
     .populate('teacherId', 'name username');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update student's classId
    await req.tenantModels.User.findByIdAndUpdate(
      studentId,
      { classId: req.params.id }
    );

    console.log('Student added successfully');
    
    // Log in both admin activity and tenant activity logs
    await logAdminActivity(req.user._id, req.user.username, 'ADD_STUDENT', 'CLASS', updatedClass._id, updatedClass.name, { studentId }, req);
    
    await req.tenantModels.ActivityLog.create({
      userId: req.user._id,
      action: 'ASSIGN_STUDENT_CLASS',
      targetType: 'class',
      targetId: updatedClass._id.toString(),
      details: { studentId, className: updatedClass.name },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json(updatedClass);
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Remove student from class (admin only)
router.put('/:id/remove-student', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { studentId } = req.body;
    
    const updatedClass = await req.tenantModels.Class.findByIdAndUpdate(
      req.params.id,
      { $pull: { studentIds: studentId } },
      { new: true }
    ).populate('studentIds', 'name username');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove classId from student
    await req.tenantModels.User.findByIdAndUpdate(
      studentId,
      { $unset: { classId: 1 } }
    );

    await logAdminActivity(req.user._id, req.user.username, 'REMOVE_STUDENT', 'CLASS', updatedClass._id, updatedClass.name, { studentId }, req);
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reassign student to different class (admin only)
router.put('/reassign-student', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { studentId, fromClassId, toClassId } = req.body;
    
    await Promise.all([
      req.tenantModels.Class.findByIdAndUpdate(fromClassId, { $pull: { studentIds: studentId } }),
      req.tenantModels.Class.findByIdAndUpdate(toClassId, { $addToSet: { studentIds: studentId } }),
      req.tenantModels.User.findByIdAndUpdate(studentId, { classId: toClassId })
    ]);
    
    // Log in both admin activity and tenant activity logs
    await logAdminActivity(req.user._id, req.user.username, 'REASSIGN_STUDENT', 'CLASS', toClassId, 'Student Reassignment', { studentId, fromClassId, toClassId }, req);
    
    await req.tenantModels.ActivityLog.create({
      userId: req.user._id,
      action: 'REASSIGN_STUDENT_CLASS',
      targetType: 'class',
      targetId: toClassId,
      details: { studentId, fromClassId, toClassId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({ message: 'Student reassigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { name, grade, teacherId, studentIds } = req.body;
    
    // Check if teacher is already assigned to another class
    if (teacherId) {
      const existingClass = await req.tenantModels.Class.findOne({ 
        teacherId, 
        _id: { $ne: req.params.id } 
      });
      if (existingClass) {
        return res.status(400).json({ message: 'Teacher is already assigned to another class' });
      }
    }
    
    const updatedClass = await req.tenantModels.Class.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        grade, 
        teacherId: teacherId || null,
        studentIds: studentIds || []
      },
      { new: true }
    ).populate('teacherId', 'name username')
     .populate('studentIds', 'name username');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Log in both admin activity and tenant activity logs
    await logAdminActivity(req.user._id, req.user.username, 'UPDATE_CLASS', 'CLASS', updatedClass._id, updatedClass.name, { name, grade }, req);
    
    await req.tenantModels.ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_CLASS',
      targetType: 'class',
      targetId: updatedClass._id.toString(),
      details: { name, grade, teacherId },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class (admin only)
router.delete('/:id', tenantAuth, adminAuth, async (req, res) => {
  try {
    const deletedClass = await req.tenantModels.Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await logAdminActivity(req.user._id, req.user.username, 'DELETE_CLASS', 'CLASS', deletedClass._id, deletedClass.name, {}, req);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;