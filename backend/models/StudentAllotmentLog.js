const mongoose = require('mongoose');

const studentAllotmentLogSchema = new mongoose.Schema({
  action: { type: String, required: true, enum: ['ASSIGN', 'REASSIGN', 'REMOVE'] },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: {
    fromClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    toClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    fromTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rollNumber: String,
    reason: String
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudentAllotmentLog', studentAllotmentLogSchema);