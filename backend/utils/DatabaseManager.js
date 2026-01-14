const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.connections = new Map();
    this.masterConnection = null;
  }

  // Get master database connection
  getMasterConnection() {
    if (!this.masterConnection) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_crm_master';
      this.masterConnection = mongoose.createConnection(mongoUri);
      this.masterConnection.on('connected', () => {
        console.log('✅ Connected to Master Database: smart_crm_master');
      });
      this.masterConnection.on('error', (err) => {
        console.error('❌ Master Database connection error:', err);
      });
    }
    return this.masterConnection;
  }

  // Get tenant database connection
  getTenantConnection(databaseName) {
    if (!this.connections.has(databaseName)) {
      const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const tenantUri = baseUri.replace(/\/[^/]*\?/, `/${databaseName}?`);
      const connection = mongoose.createConnection(tenantUri);
      this.connections.set(databaseName, connection);
    }
    return this.connections.get(databaseName);
  }

  // Delete tenant database
  async deleteTenantDatabase(databaseName) {
    try {
      const connection = this.getTenantConnection(databaseName);
      await connection.dropDatabase();
      connection.close();
      this.connections.delete(databaseName);
    } catch (error) {
      console.error('Error deleting tenant database:', error);
    }
  }

  // Get tenant models
  getTenantModels(databaseName) {
    const connection = this.getTenantConnection(databaseName);
    
    return {
      User: connection.model('User', require('../models/User').schema),
      Class: connection.model('Class', require('../models/Class').schema),
      Schedule: connection.model('Schedule', require('../models/Schedule').schema),
      Notice: connection.model('Notice', require('../models/Notice').schema),
      Subject: connection.model('Subject', require('../models/Subject').schema),
      Message: connection.model('Message', require('../models/Message').schema),
      Calendar: connection.model('Calendar', require('../models/Calendar').schema),
      ScheduleLog: connection.model('ScheduleLog', require('../models/ScheduleLog').schema),
      StudentAllotmentLog: connection.model('StudentAllotmentLog', require('../models/StudentAllotmentLog').schema),
      NoticeLog: connection.model('NoticeLog', require('../models/NoticeLog').schema)
    };
  }
}

module.exports = new DatabaseManager();