const DatabaseManager = require('../utils/DatabaseManager');

const logActivity = async (req, action, targetType, targetId = null, targetName = null, details = {}) => {
  try {
    if (req.tenantModels && req.tenantModels.ActivityLog) {
      await req.tenantModels.ActivityLog.create({
        userId: req.user._id,
        action,
        targetType,
        targetId,
        targetName,
        details,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }
  } catch (error) {
    console.log('Activity logging failed (non-critical):', error.message);
  }
};

const logAdminActivity = async (adminId, adminUsername, action, targetType, targetId = null, targetName = null, details = {}, req = null) => {
  try {
    const masterConnection = DatabaseManager.getMasterConnection();
    const AdminActivityLog = masterConnection.model('AdminActivityLog', require('../models/AdminActivityLog').schema);
    
    const log = new AdminActivityLog({
      adminId,
      adminUsername,
      action,
      targetType,
      targetId,
      targetName,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent')
    });
    
    await log.save();
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
};

const activityLogger = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.role === 'admin') {
        await logAdminActivity(
          req.user.id,
          req.user.username,
          action,
          'Subject',
          req.params.id,
          req.body.name,
          req.body,
          req
        );
      }
    } catch (error) {
      console.error('Activity logging failed:', error);
    }
    next();
  };
};

module.exports = { logAdminActivity, activityLogger, logActivity };