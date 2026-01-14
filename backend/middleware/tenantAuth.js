const jwt = require('jsonwebtoken');
const DatabaseManager = require('../utils/DatabaseManager');
const { logAdminActivity } = require('./activityLogger');

const tenantAuth = async (req, res, next) => {
  try {
    console.log('TenantAuth middleware called');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { userId: decoded.userId, role: decoded.role, databaseName: decoded.databaseName });
    const { databaseName, role } = decoded;
    
    if (!databaseName) {
      console.log('No database name in token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (role === 'admin') {
      console.log('Admin authentication');
      // For admin, get from master database
      const masterConnection = DatabaseManager.getMasterConnection();
      const AdminRegistry = masterConnection.model('AdminRegistry', require('../models/AdminRegistry').schema);
      const user = await AdminRegistry.findById(decoded.userId);
      if (!user) {
        console.log('Admin user not found');
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = { ...user.toObject(), role: 'admin' };
      console.log('Admin user authenticated:', user.username);
    } else {
      console.log('Non-admin authentication');
      // For other users, get from tenant database
      req.tenantModels = DatabaseManager.getTenantModels(databaseName);
      const user = await req.tenantModels.User.findById(decoded.userId);
      if (!user) {
        console.log('Tenant user not found');
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      console.log('Tenant user authenticated:', user.username);
    }

    req.databaseName = databaseName;
    req.tenantModels = DatabaseManager.getTenantModels(databaseName);
    console.log('TenantAuth successful, proceeding to next middleware');
    next();
  } catch (error) {
    console.error('Auth error:', error.message, error.stack);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { tenantAuth, adminAuth };