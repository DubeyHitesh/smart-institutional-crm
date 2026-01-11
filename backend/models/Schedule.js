const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isRecurring: { type: Boolean, default: true },
  academicYear: { type: String, required: true }
}, { timestamps: true });

// Index for efficient conflict checking
scheduleSchema.index({ teacherId: 1, day: 1, startTime: 1, endTime: 1 });
scheduleSchema.index({ classId: 1, day: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);