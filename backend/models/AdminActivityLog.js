const mongoose = require('mongoose');

const adminActivityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
  adminUsername: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true }, // USER, CLASS, SCHEDULE, NOTICE, etc.
  targetId: { type: String },
  targetName: { type: String },
  details: { type: Object },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AdminActivityLog', adminActivityLogSchema);