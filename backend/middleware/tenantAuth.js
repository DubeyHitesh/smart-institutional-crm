const jwt = require('jsonwebtoken');
const DatabaseManager = require('../utils/DatabaseManager');
const { logAdminActivity } = require('./activityLogger');

const tenantAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { databaseName, role } = decoded;
    
    if (!databaseName) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (role === 'admin') {
      // For admin, get from master database
      const masterConnection = DatabaseManager.getMasterConnection();
      const AdminRegistry = masterConnection.model('AdminRegistry', require('../models/AdminRegistry').schema);
      const user = await AdminRegistry.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = { ...user.toObject(), role: 'admin' };
    } else {
      // For other users, get from tenant database
      req.tenantModels = DatabaseManager.getTenantModels(databaseName);
      const user = await req.tenantModels.User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
    }

    req.databaseName = databaseName;
    req.tenantModels = DatabaseManager.getTenantModels(databaseName);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { tenantAuth, adminAuth };