const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRoles: [{ type: String, enum: ['teacher', 'student'], required: true }],
  isRead: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);