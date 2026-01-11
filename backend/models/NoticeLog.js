const mongoose = require('mongoose');

const noticeLogSchema = new mongoose.Schema({
  action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'READ', 'MARK_READ'] },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: {
    title: String,
    content: String,
    targetRoles: [String],
    readBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For read actions
    previousData: mongoose.Schema.Types.Mixed // For updates
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('NoticeLog', noticeLogSchema);