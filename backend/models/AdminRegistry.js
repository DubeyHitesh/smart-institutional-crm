const mongoose = require('mongoose');

const adminRegistrySchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  institutionName: { type: String, required: true },
  databaseName: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('AdminRegistry', adminRegistrySchema);