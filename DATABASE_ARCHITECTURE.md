# 🗄️ Database Architecture - Smart Institutional CRM

## 📊 Database Overview

### Multi-Tenant Architecture
The system uses **MongoDB Atlas** with a sophisticated multi-tenant architecture where each educational institution gets its own isolated database.

### Database Types
1. **Master Database**: `smart_crm_master`
2. **Tenant Databases**: `smart_crm_[username]_[timestamp]`

---

## 🏗️ Master Database (`smart_crm_master`)

### Purpose
- Central registry for all admin accounts
- Cross-tenant activity logging
- System-wide user tracking

### Collections

#### AdminRegistry
```javascript
{
  _id: ObjectId,
  username: String,           // Unique admin username
  password: String,           // Hashed password
  name: String,              // Admin full name
  institutionName: String,   // Institution name
  databaseName: String,      // Tenant database name
  isActive: Boolean,         // Account status
  createdAt: Date,
  updatedAt: Date
}
```

#### MasterActivityLog
```javascript
{
  _id: ObjectId,
  adminId: ObjectId,         // Reference to admin
  username: String,
  action: String,            // CREATE, UPDATE, DELETE, LOGIN
  targetType: String,        // USER, CLASS, SCHEDULE, etc.
  targetId: ObjectId,
  targetName: String,
  details: Object,           // Additional data
  ipAddress: String,
  userAgent: String,
  timestamp: Date,
  databaseName: String       // Which tenant DB
}
```

---

## 🏢 Tenant Databases (`smart_crm_[username]_[timestamp]`)

### Database Creation Logic
```javascript
// When admin registers
const databaseName = `smart_crm_${username}_${Date.now()}`;
```

### Collections Structure

#### Users
```javascript
{
  _id: ObjectId,
  username: String,          // Unique within tenant
  password: String,          // Hashed
  role: String,             // 'teacher' | 'student'
  name: String,
  email: String,
  phone: String,
  address: String,
  dateOfBirth: Date,
  joiningDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Classes
```javascript
{
  _id: ObjectId,
  name: String,             // "Class 10-A"
  grade: Number,            // 1-12
  section: String,          // "A", "B", "C"
  teacherId: ObjectId,      // Assigned teacher
  students: [ObjectId],     // Array of student IDs
  maxStudents: Number,      // Capacity
  subjects: [String],       // Subject names
  createdAt: Date,
  updatedAt: Date
}
```

#### Schedules
```javascript
{
  _id: ObjectId,
  teacherId: ObjectId,
  classId: ObjectId,
  subject: String,
  day: String,              // "Monday", "Tuesday", etc.
  period: Number,           // 1-10
  timeSlot: String,         // "9:00-9:30"
  createdAt: Date
}
```

#### Assignments
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  teacherId: ObjectId,
  classIds: [ObjectId],     // Multiple classes
  dueDate: Date,
  attachments: [String],    // File paths
  submissions: [{
    studentId: ObjectId,
    submittedAt: Date,
    files: [String],
    status: String,         // "pending", "submitted", "graded"
    grade: Number,
    feedback: String,
    isAccepted: Boolean
  }],
  createdAt: Date
}
```

#### Messages
```javascript
{
  _id: ObjectId,
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  messageType: String,      // "text", "audio"
  filePath: String,         // For audio messages
  replyTo: ObjectId,        // Reply reference
  isRead: Boolean,
  timestamp: Date
}
```

#### Calendar
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  type: String,            // "holiday", "event"
  isHoliday: Boolean,
  createdBy: ObjectId,     // Admin who created
  createdAt: Date
}
```

#### Subjects
```javascript
{
  _id: ObjectId,
  name: String,            // "Mathematics"
  code: String,            // "MATH101"
  grade: Number,           // 1-12
  teacherId: ObjectId,     // Assigned teacher
  description: String,
  createdAt: Date
}
```

#### ActivityLog (Tenant-specific)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  username: String,
  role: String,
  action: String,
  targetType: String,
  targetId: ObjectId,
  targetName: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

---

## 🔄 Database Operations & Lifecycle

### Database Creation
**When**: Admin registration
**Process**:
1. Validate admin doesn't exist
2. Generate unique database name
3. Hash password
4. Save to master database
5. Create tenant database connection
6. Initialize collections with indexes

### Database Connection Management
```javascript
class DatabaseManager {
  // Master connection (singleton)
  getMasterConnection() {
    return mongoose.createConnection(MONGODB_URI);
  }
  
  // Tenant connections (cached)
  getTenantConnection(databaseName) {
    if (!this.connections.has(databaseName)) {
      const uri = MONGODB_URI.replace(/\/[^/]*\?/, `/${databaseName}?`);
      const connection = mongoose.createConnection(uri);
      this.connections.set(databaseName, connection);
    }
    return this.connections.get(databaseName);
  }
}
```

### Database Deletion
**When**: Admin account deletion
**Process**:
1. Verify admin ownership
2. Drop entire tenant database
3. Close database connection
4. Remove from connection cache
5. Delete admin from master registry
6. Log deletion activity

### Data Isolation
- **Complete Separation**: Each institution's data is in separate database
- **No Cross-Contamination**: Users from one institution cannot access another's data
- **Independent Scaling**: Each database can be optimized separately

---

## 🔐 Security & Access Control

### Authentication Flow
1. **Login Request** → Check master database for admin OR tenant database for users
2. **JWT Token** → Contains `userId`, `role`, `databaseName`
3. **Middleware** → Validates token and connects to correct database
4. **Authorization** → Role-based access within tenant database

### Data Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Secrets**: Environment variable protection
- **Database Isolation**: Physical separation of tenant data
- **Connection Encryption**: MongoDB Atlas TLS/SSL

---

## 📈 Performance & Optimization

### Indexing Strategy
```javascript
// Users collection
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Classes collection
db.classes.createIndex({ grade: 1, section: 1 });
db.classes.createIndex({ teacherId: 1 });

// Schedules collection
db.schedules.createIndex({ teacherId: 1, day: 1 });
db.schedules.createIndex({ classId: 1, day: 1 });

// Messages collection
db.messages.createIndex({ senderId: 1, receiverId: 1 });
db.messages.createIndex({ timestamp: -1 });
```

### Connection Pooling
- **Master Connection**: Single persistent connection
- **Tenant Connections**: Cached and reused per database
- **Connection Limits**: MongoDB Atlas handles automatically

### Query Optimization
- **Selective Fields**: `.select('-password')` excludes sensitive data
- **Pagination**: Limit results for large datasets
- **Aggregation**: Complex queries use MongoDB aggregation pipeline

---

## 🚨 Error Handling & Recovery

### Database Failures
```javascript
// Graceful error handling
try {
  const users = await req.tenantModels.User.find();
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ message: 'Database unavailable' });
}
```

### Connection Issues
- **Retry Logic**: Automatic reconnection attempts
- **Timeout Handling**: 10-second connection timeout
- **Fallback**: Continue without database for non-critical operations

### Data Consistency
- **Transactions**: For multi-collection operations
- **Validation**: Mongoose schema validation
- **Referential Integrity**: Manual foreign key checks

---

## 📊 Monitoring & Analytics

### Activity Logging
**Dual Logging System**:
- **Master Logs**: Cross-tenant administrative actions
- **Tenant Logs**: Institution-specific activities

### Tracked Activities
- User CRUD operations
- Class management
- Schedule changes
- Message sending
- Assignment operations
- Authentication events

### Performance Metrics
- **Connection Count**: Active database connections
- **Query Performance**: Slow query identification
- **Storage Usage**: Per-tenant database size
- **Error Rates**: Failed operations tracking

---

## 🔧 Maintenance & Backup

### Backup Strategy
- **MongoDB Atlas**: Automatic cloud backups
- **Point-in-Time Recovery**: Available for critical data
- **Cross-Region Replication**: Built-in redundancy

### Database Maintenance
- **Index Optimization**: Regular index analysis
- **Collection Cleanup**: Remove old activity logs
- **Connection Pool Management**: Monitor and optimize

### Scaling Considerations
- **Horizontal Scaling**: Add more tenant databases
- **Vertical Scaling**: Increase MongoDB Atlas tier
- **Sharding**: For very large institutions

---

## 🎯 Best Practices

### Development
1. **Always use tenant-specific models**
2. **Validate database name in JWT**
3. **Handle connection failures gracefully**
4. **Log all database operations**
5. **Use transactions for multi-step operations**

### Production
1. **Monitor connection counts**
2. **Set up alerts for failures**
3. **Regular backup verification**
4. **Performance monitoring**
5. **Security audit trails**

### Data Management
1. **Regular cleanup of old logs**
2. **Archive inactive institutions**
3. **Monitor storage usage**
4. **Optimize slow queries**
5. **Maintain referential integrity**

---

## 🔍 Troubleshooting Common Issues

### Connection Timeouts
```javascript
// Increase timeout
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});
```

### Memory Leaks
```javascript
// Proper connection cleanup
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

### Data Inconsistency
```javascript
// Use transactions
const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    // Multiple operations
  });
} finally {
  await session.endSession();
}
```

This multi-tenant database architecture provides complete data isolation, scalability, and security for educational institutions while maintaining centralized administration capabilities.