# ⚙️ Backend Architecture - Smart Institutional CRM

## 🚀 Technology Stack

### Core Technologies
- **Node.js 14+** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose 6.8.4** - MongoDB object modeling

### Security & Authentication
- **JWT (jsonwebtoken 9.0.0)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Helmet 6.0.1** - Security headers

### File Handling & Utilities
- **Multer 2.0.2** - File upload middleware
- **dotenv 16.0.3** - Environment variable management
- **Compression 1.7.4** - Response compression
- **Express Rate Limit 6.6.0** - API rate limiting

---

## 🏗️ Project Structure

```
backend/
├── models/                  # MongoDB schemas
│   ├── AdminRegistry.js     # Master admin tracking
│   ├── User.js              # Tenant users
│   ├── Class.js             # Class management
│   ├── Schedule.js          # Timetable schedules
│   ├── Assignment.js        # Assignment system
│   ├── Message.js           # Chat messages
│   ├── Calendar.js          # Events & holidays
│   ├── Subject.js           # Subject management
│   ├── ActivityLog.js       # Activity tracking
│   └── ...                  # Other models
├── routes/                  # API endpoints
│   ├── auth.js              # Authentication
│   ├── users.js             # User management
│   ├── classes.js           # Class operations
│   ├── schedules.js         # Schedule management
│   ├── assignments.js       # Assignment CRUD
│   ├── messages.js          # Chat functionality
│   ├── calendar.js          # Calendar operations
│   └── ...                  # Other routes
├── middleware/              # Custom middleware
│   ├── tenantAuth.js        # Multi-tenant authentication
│   ├── activityLogger.js    # Activity logging
│   └── upload.js            # File upload handling
├── utils/                   # Utility modules
│   └── DatabaseManager.js  # Multi-tenant DB manager
├── uploads/                 # File storage
├── .env                     # Environment variables
└── server.js                # Express server setup
```

---

## 🔐 Authentication & Authorization

### Multi-Tenant Authentication System

#### JWT Token Structure
```javascript
{
  userId: ObjectId,          // User ID in respective database
  role: 'admin' | 'teacher' | 'student',
  databaseName: String,      // Tenant database name
  iat: Number,              // Issued at
  exp: Number               // Expiration
}
```

#### Authentication Middleware
```javascript
const tenantAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin') {
      // Admin from master database
      const masterConnection = DatabaseManager.getMasterConnection();
      const AdminRegistry = masterConnection.model('AdminRegistry');
      const user = await AdminRegistry.findById(decoded.userId);
      req.user = { ...user.toObject(), role: 'admin' };
    } else {
      // Teacher/Student from tenant database
      req.tenantModels = DatabaseManager.getTenantModels(decoded.databaseName);
      const user = await req.tenantModels.User.findById(decoded.userId);
      req.user = user;
    }
    
    req.databaseName = decoded.databaseName;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### Role-Based Authorization
```javascript
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const teacherAuth = (req, res, next) => {
  if (!['admin', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Teacher access required' });
  }
  next();
};
```

---

## 🗄️ Database Management System

### Multi-Tenant Architecture
**DatabaseManager Class**
```javascript
class DatabaseManager {
  constructor() {
    this.connections = new Map();
    this.masterConnection = null;
  }

  // Master database for admin registry
  getMasterConnection() {
    if (!this.masterConnection) {
      this.masterConnection = mongoose.createConnection(process.env.MONGODB_URI);
    }
    return this.masterConnection;
  }

  // Tenant database connections
  getTenantConnection(databaseName) {
    if (!this.connections.has(databaseName)) {
      const baseUri = process.env.MONGODB_URI;
      const tenantUri = baseUri.replace(/\/[^/]*\?/, `/${databaseName}?`);
      const connection = mongoose.createConnection(tenantUri);
      this.connections.set(databaseName, connection);
    }
    return this.connections.get(databaseName);
  }

  // Get models for specific tenant
  getTenantModels(databaseName) {
    const connection = this.getTenantConnection(databaseName);
    return {
      User: connection.model('User', UserSchema),
      Class: connection.model('Class', ClassSchema),
      Schedule: connection.model('Schedule', ScheduleSchema),
      // ... other models
    };
  }
}
```

### Database Lifecycle Management

#### Database Creation
```javascript
// On admin registration
app.post('/api/setup/admin', async (req, res) => {
  try {
    const { username, password, name, institutionName } = req.body;
    
    // Generate unique database name
    const databaseName = `smart_crm_${username}_${Date.now()}`;
    
    // Create admin in master database
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new AdminRegistry({
      username,
      password: hashedPassword,
      name,
      institutionName,
      databaseName,
      isActive: true
    });
    
    await admin.save();
    
    // Initialize tenant database (lazy creation)
    // Database is created when first model is accessed
    
    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

#### Database Deletion
```javascript
// On admin account deletion
router.delete('/delete-account', tenantAuth, adminAuth, async (req, res) => {
  try {
    const { databaseName } = req;
    
    // Delete tenant database
    await DatabaseManager.deleteTenantDatabase(databaseName);
    
    // Remove admin from master registry
    const masterConnection = DatabaseManager.getMasterConnection();
    const AdminRegistry = masterConnection.model('AdminRegistry');
    await AdminRegistry.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

---

## 📊 Data Models & Schemas

### User Schema (Tenant Database)
```javascript
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'student'], required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
```

### Class Schema
```javascript
const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 12 },
  section: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxStudents: { type: Number, default: 40 },
  subjects: [{ type: String }]
}, { timestamps: true });

ClassSchema.index({ grade: 1, section: 1 });
ClassSchema.index({ teacherId: 1 });
```

### Assignment Schema
```javascript
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  dueDate: { type: Date, required: true },
  attachments: [{ type: String }],
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now },
    files: [{ type: String }],
    status: { 
      type: String, 
      enum: ['pending', 'submitted', 'graded', 'reassigned'],
      default: 'pending'
    },
    grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String },
    isAccepted: { type: Boolean, default: false }
  }]
}, { timestamps: true });
```

---

## 🔄 API Route Architecture

### RESTful API Design
**Consistent URL Structure**
```
/api/auth/*          - Authentication endpoints
/api/users/*         - User management
/api/classes/*       - Class operations
/api/schedules/*     - Schedule management
/api/assignments/*   - Assignment CRUD
/api/messages/*      - Chat functionality
/api/calendar/*      - Calendar operations
```

### Route Protection Pattern
```javascript
// Public routes
router.post('/login', authController.login);
router.post('/setup/admin', authController.setupAdmin);

// Protected routes (require authentication)
router.get('/users', tenantAuth, adminAuth, userController.getUsers);
router.post('/users', tenantAuth, adminAuth, userController.createUser);

// Role-specific routes
router.get('/my-classes', tenantAuth, teacherAuth, classController.getMyClasses);
router.get('/my-assignments', tenantAuth, assignmentController.getMyAssignments);
```

### Error Handling Middleware
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: err.errors 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      message: 'Invalid ID format' 
    });
  }
  
  res.status(500).json({ 
    message: 'Internal Server Error' 
  });
};
```

---

## 📝 Activity Logging System

### Dual Logging Architecture
**Master Database Logging**
```javascript
const logMasterActivity = async (adminId, username, action, targetType, targetId, targetName, details, req) => {
  try {
    const masterConnection = DatabaseManager.getMasterConnection();
    const MasterActivityLog = masterConnection.model('MasterActivityLog');
    
    await MasterActivityLog.create({
      adminId,
      username,
      action,
      targetType,
      targetId,
      targetName,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      databaseName: req.databaseName
    });
  } catch (error) {
    console.error('Master logging failed:', error);
  }
};
```

**Tenant Database Logging**
```javascript
const logTenantActivity = async (userId, username, role, action, targetType, targetId, targetName, details, req) => {
  try {
    const ActivityLog = req.tenantModels.ActivityLog;
    
    await ActivityLog.create({
      userId,
      username,
      role,
      action,
      targetType,
      targetId,
      targetName,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Tenant logging failed:', error);
  }
};
```

### Activity Logger Middleware
```javascript
const activityLogger = (action, targetType) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log activity after successful response
      if (res.statusCode < 400) {
        logActivity(req.user, action, targetType, req, data);
      }
      
      // Call original res.json
      return originalJson.call(this, data);
    };
    
    next();
  };
};
```

---

## 📁 File Upload System

### Multer Configuration
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt|mp3|wav/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
```

### File Upload Routes
```javascript
// Assignment file upload
router.post('/assignments/:id/upload', 
  tenantAuth, 
  upload.array('files', 5), 
  async (req, res) => {
    try {
      const assignment = await req.tenantModels.Assignment.findById(req.params.id);
      
      // Add file paths to assignment
      const filePaths = req.files.map(file => file.path);
      assignment.attachments.push(...filePaths);
      
      await assignment.save();
      res.json({ message: 'Files uploaded successfully', files: filePaths });
    } catch (error) {
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);
```

---

## 🤖 Auto Timetable Generator

### Intelligent Scheduling Algorithm
```javascript
const generateAutoTimetable = async (req, res) => {
  try {
    const { teacherIds, maxPeriodsPerDay, maxPeriodsPerWeek } = req.body;
    
    // Get teachers and their assigned classes
    const teachers = await req.tenantModels.User.find({
      _id: { $in: teacherIds },
      role: 'teacher'
    });
    
    const classes = await req.tenantModels.Class.find({
      teacherId: { $in: teacherIds }
    });
    
    // Generate schedule with conflict detection
    const schedules = [];
    const timeSlots = generateTimeSlots();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (const teacher of teachers) {
      const teacherClasses = classes.filter(c => 
        c.teacherId.toString() === teacher._id.toString()
      );
      
      let periodsAssigned = 0;
      const dailyPeriods = {};
      
      for (const day of days) {
        dailyPeriods[day] = 0;
        
        for (const period of timeSlots) {
          if (periodsAssigned >= maxPeriodsPerWeek) break;
          if (dailyPeriods[day] >= maxPeriodsPerDay) break;
          
          // Check for conflicts
          const hasConflict = await checkScheduleConflict(
            teacher._id, 
            day, 
            period.number
          );
          
          if (!hasConflict && teacherClasses.length > 0) {
            const classToAssign = teacherClasses[periodsAssigned % teacherClasses.length];
            
            schedules.push({
              teacherId: teacher._id,
              classId: classToAssign._id,
              subject: getSubjectForGrade(classToAssign.grade),
              day,
              period: period.number,
              timeSlot: period.time
            });
            
            periodsAssigned++;
            dailyPeriods[day]++;
          }
        }
      }
    }
    
    // Save generated schedules
    await req.tenantModels.Schedule.insertMany(schedules);
    
    res.json({ 
      message: 'Timetable generated successfully',
      schedulesCreated: schedules.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Timetable generation failed' });
  }
};
```

---

## 💬 Real-Time Messaging System

### Message Schema & Operations
```javascript
const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'audio'], default: 'text' },
  filePath: { type: String }, // For audio messages
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// Get conversation between two users
router.get('/messages/:userId', tenantAuth, async (req, res) => {
  try {
    const messages = await req.tenantModels.Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 }).populate('replyTo');
    
    // Mark messages as read
    await req.tenantModels.Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});
```

---

## 🔒 Security Implementation

### Password Security
```javascript
// Password hashing on user creation
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification on login
const isValidPassword = await bcrypt.compare(password, user.password);
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Input Validation
```javascript
const validateUser = (req, res, next) => {
  const { username, password, role } = req.body;
  
  if (!username || username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  if (!['teacher', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  
  next();
};
```

---

## 📈 Performance Optimization

### Database Indexing
```javascript
// User indexes
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });

// Schedule indexes
ScheduleSchema.index({ teacherId: 1, day: 1 });
ScheduleSchema.index({ classId: 1, day: 1 });

// Message indexes
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ timestamp: -1 });
```

### Query Optimization
```javascript
// Efficient user lookup with selected fields
const users = await req.tenantModels.User
  .find({ role: 'student' })
  .select('-password')
  .limit(50)
  .sort({ name: 1 });

// Aggregation for complex queries
const classStats = await req.tenantModels.Class.aggregate([
  { $match: { teacherId: req.user._id } },
  { $group: { _id: '$grade', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);
```

### Connection Pooling
```javascript
// MongoDB connection options
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
};
```

---

## 🚨 Error Handling & Monitoring

### Graceful Error Handling
```javascript
// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/users', asyncHandler(async (req, res) => {
  const users = await req.tenantModels.User.find();
  res.json(users);
}));
```

### Health Check Endpoint
```javascript
router.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    const masterConnection = DatabaseManager.getMasterConnection();
    await masterConnection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Process Management
```javascript
// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Close database connections
  await mongoose.connection.close();
  
  // Close server
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Unhandled rejection handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

This backend architecture provides a robust, scalable, and secure foundation for the multi-tenant educational CRM system with comprehensive data isolation, authentication, and real-time features.