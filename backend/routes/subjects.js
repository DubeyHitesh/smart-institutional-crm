const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User');
const { tenantAuth } = require('../middleware/tenantAuth');
const { activityLogger } = require('../middleware/activityLogger');

// Get all subjects
router.get('/', tenantAuth, async (req, res) => {
  try {
    const Subject = req.tenantModels.Subject;
    const subjects = await Subject.find().populate('assignedTeacher', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Create new subject
router.post('/', tenantAuth, activityLogger('Subject Created'), async (req, res) => {
  try {
    console.log('Creating subject with data:', req.body);
    console.log('User:', req.user);
    console.log('Tenant models available:', Object.keys(req.tenantModels || {}));
    
    const { name, description } = req.body;
    const Subject = req.tenantModels.Subject;
    
    if (!Subject) {
      console.error('Subject model not found in tenant models');
      return res.status(500).json({ message: 'Subject model not available' });
    }
    
    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: name.trim() });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const subject = new Subject({
      name: name.trim(),
      description: description?.trim(),
      createdBy: req.user.id || req.user._id
    });

    await subject.save();
    console.log('Subject created successfully:', subject);
    
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ message: 'Error creating subject', error: error.message });
  }
});

// Assign teacher to subject
router.put('/:id/assign', tenantAuth, activityLogger('Teacher Assigned to Subject'), async (req, res) => {
  try {
    const { teacherId } = req.body;
    const User = req.tenantModels.User;
    const Subject = req.tenantModels.Subject;
    
    // Verify teacher exists and is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid teacher selected' });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { assignedTeacher: teacherId },
      { new: true }
    ).populate('assignedTeacher', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning teacher', error: error.message });
  }
});

// Remove teacher from subject
router.put('/:id/unassign', tenantAuth, activityLogger('Teacher Unassigned from Subject'), async (req, res) => {
  try {
    const Subject = req.tenantModels.Subject;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { assignedTeacher: null },
      { new: true }
    ).populate('assignedTeacher', 'name email');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning teacher', error: error.message });
  }
});

// Delete subject
router.delete('/:id', tenantAuth, activityLogger('Subject Deleted'), async (req, res) => {
  try {
    const Subject = req.tenantModels.Subject;
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
});

module.exports = router;