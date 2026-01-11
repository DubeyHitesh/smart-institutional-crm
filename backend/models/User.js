const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  name: String,
  email: String,
  phone: String,
  address: String,
  class: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  rollNumber: String,
  department: String,
  employeeId: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);