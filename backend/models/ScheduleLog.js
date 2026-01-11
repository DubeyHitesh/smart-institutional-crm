const mongoose = require('mongoose');

const scheduleLogSchema = new mongoose.Schema({
  action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'BULK_CREATE'] },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    day: String,
    startTime: String,
    endTime: String,
    academicYear: String,
    scheduleCount: Number // For bulk operations
  },
  previousData: mongoose.Schema.Types.Mixed, // Store old data for updates
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ScheduleLog', scheduleLogSchema);