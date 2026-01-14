const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const DatabaseManager = require('./utils/DatabaseManager');
require('dotenv').config();

const app = express();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://smartinsticrm.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files for audio uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to master MongoDB
const connectDB = async () => {
  try {
    const masterConnection = DatabaseManager.getMasterConnection();
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
      masterConnection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      masterConnection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
    console.log('✅ Master MongoDB connection established');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing without database connection');
  }
};

connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const scheduleRoutes = require('./routes/schedules');
const noticeRoutes = require('./routes/notices');
const assignmentRoutes = require('./routes/assignments');
const subjectRoutes = require('./routes/subjects');
const messageRoutes = require('./routes/messages');
const calendarRoutes = require('./routes/calendar');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calendar', calendarRoutes);

// Admin setup route
app.post('/api/setup/admin', async (req, res) => {
  try {
    console.log('Admin setup route called');
    const masterConnection = DatabaseManager.getMasterConnection();
    console.log('Master connection obtained');
    
    const AdminRegistry = masterConnection.model('AdminRegistry', require('./models/AdminRegistry').schema);
    console.log('AdminRegistry model created');
    
    const { username, password, name, institutionName } = req.body;
    console.log('Registration data:', { username, name, institutionName });
    
    const adminExists = await AdminRegistry.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const databaseName = `smart_crm_${username}_${Date.now()}`;
    
    const admin = new AdminRegistry({
      username,
      password: hashedPassword,
      name,
      institutionName,
      databaseName,
      isActive: true
    });
    
    console.log('Saving admin to database...');
    await admin.save();
    console.log('Admin saved successfully');
    
    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if any admin exists
app.get('/api/setup/check', async (req, res) => {
  try {
    const masterConnection = DatabaseManager.getMasterConnection();
    const AdminRegistry = masterConnection.model('AdminRegistry', require('./models/AdminRegistry').schema);
    const admins = await AdminRegistry.find({});
    console.log('All admins in database:', admins);
    res.json({ adminExists: admins.length > 0, count: admins.length, admins: admins.map(a => ({ username: a.username, name: a.name })) });
  } catch (error) {
    console.error('Check admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ Multi-tenant architecture enabled');
  console.log('✅ Backend ready for connections');
});