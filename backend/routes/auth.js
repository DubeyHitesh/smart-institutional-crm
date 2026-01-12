const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DatabaseManager = require('../utils/DatabaseManager');
const { tenantAuth } = require('../middleware/tenantAuth');
const { logAdminActivity } = require('../middleware/activityLogger');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;
    
    // First check in master admin registry
    const masterConnection = DatabaseManager.getMasterConnection();
    const AdminRegistryModel = masterConnection.model('AdminRegistry', require('../models/AdminRegistry').schema);
    
    const admin = await AdminRegistryModel.findOne({ username });
    
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Log login activity
      await logAdminActivity(admin._id, admin.username, 'LOGIN', 'AUTH', null, null, { loginTime: new Date() }, req);

      const token = jwt.sign({ 
        userId: admin._id, 
        databaseName: admin.databaseName,
        role: 'admin'
      }, process.env.JWT_SECRET || 'fallback-secret');
      
      console.log('Admin login successful for:', username);
      return res.json({
        token,
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin',
          name: admin.name,
          institutionName: admin.institutionName,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin
        }
      });
    }
    
    // If not admin, search in all tenant databases for teachers/students
    const allAdmins = await AdminRegistryModel.find({});
    
    for (const adminRecord of allAdmins) {
      try {
        const tenantConnection = DatabaseManager.getTenantConnection(adminRecord.databaseName);
        const UserModel = tenantConnection.model('User', require('../models/User').schema);
        
        const user = await UserModel.findOne({ username, role: { $in: ['teacher', 'student'] } });
        
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign({ 
              userId: user._id, 
              databaseName: adminRecord.databaseName,
              role: user.role
            }, process.env.JWT_SECRET || 'fallback-secret');
            
            console.log(`${user.role} login successful for:`, username);
            
            // Log login activity for teachers/students
            try {
              const tenantConnection = DatabaseManager.getTenantConnection(adminRecord.databaseName);
              const ActivityLogModel = tenantConnection.model('ActivityLog', require('../models/ActivityLog').schema);
              
              await ActivityLogModel.create({
                userId: user._id,
                action: 'LOGIN',
                targetType: 'AUTH',
                details: { loginTime: new Date(), role: user.role },
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
              });
            } catch (logError) {
              console.log('Activity logging failed (non-critical):', logError.message);
            }
            
            return res.json({
              token,
              user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                class: user.class,
                classId: user.classId,
                rollNumber: user.rollNumber,
                department: user.department,
                employeeId: user.employeeId,
                isActive: user.isActive,
                lastLogin: user.lastLogin
              }
            });
          }
        }
      } catch (dbError) {
        console.log(`Error checking database ${adminRecord.databaseName}:`, dbError.message);
        continue;
      }
    }
    
    // If no user found in any database
    return res.status(400).json({ message: 'Invalid credentials' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get current user
router.get('/me', tenantAuth, async (req, res) => {
  try {
    if (req.tenantModels && req.tenantModels.ActivityLog) {
      await req.tenantModels.ActivityLog.create({
        userId: req.user._id,
        action: 'VIEW_PROFILE',
        targetType: 'USER',
        targetId: req.user._id,
        targetName: req.user.username,
        details: { role: req.user.role },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }
  } catch (logError) {
    console.log('Activity logging failed (non-critical):', logError.message);
  }
  
  res.json({
    id: req.user._id,
    username: req.user.username,
    role: req.user.role,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    class: req.user.class,
    classId: req.user.classId,
    rollNumber: req.user.rollNumber,
    department: req.user.department,
    employeeId: req.user.employeeId,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin
  });
});

// Delete current user account
router.delete('/delete-account', tenantAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Log account deletion
      await logAdminActivity(req.user._id, req.user.username, 'DELETE_ACCOUNT', 'ADMIN', req.user._id, req.user.username, { databaseName: req.databaseName }, req);
      
      // Delete entire tenant database
      await DatabaseManager.deleteTenantDatabase(req.databaseName);
      
      // Remove admin from master registry
      const masterConnection = DatabaseManager.getMasterConnection();
      const AdminRegistryModel = masterConnection.model('AdminRegistry', require('../models/AdminRegistry').schema);
      await AdminRegistryModel.findOneAndDelete({ databaseName: req.databaseName });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;