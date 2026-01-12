# 🚀 Smart Institutional CRM - Backend Documentation

## 🏗️ Backend Architecture Overview

The Smart Institutional CRM backend is built with **Node.js**, **Express.js**, and **MongoDB Atlas** using a sophisticated **multi-tenant architecture** that provides complete data isolation between educational institutions.

## 🛠️ Technology Stack

### Core Technologies
- **Node.js** (v14+) - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library
- **CORS** - Cross-Origin Resource Sharing middleware
- **Multer** - File upload handling middleware
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Development server with auto-restart
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting

## 🏢 Multi-Tenant Database Architecture

### Master Database: `smart_crm_master`
**Purpose**: Central registry and cross-tenant tracking

**Collections:**
- `adminregistries` - Admin account registry
- `adminactivitylogs` - Cross-tenant admin activity logs

**Key Features:**
- Tracks all registered educational institutions
- Stores admin credentials and institution metadata
- Maintains cross-tenant activity audit trails
- Manages database creation and cleanup

### Tenant Databases: `smart_crm_[username]_[timestamp]`
**Purpose**: Institution-specific data isolation

**Collections:**
- `users` - Teachers and students
- `classes` - Class information and assignments
- `schedules` - Timetables and schedule management
- `assignments` - Assignment data and submissions
- `messages` - Personal chat system
- `calendars` - Events and Indian holidays
- `subjects` - Subject management
- `activitylogs` - Institution-specific activity logs
- `notices` - Institutional notices

## 🔐 Authentication & Authorization System

### JWT Token Structure
```javascript
{
  userId: "user_id",
  databaseName: "tenant_database_name",
  role: "admin|teacher|student"
}
```

### Authentication Flow
1. **Login Request** - User provides username/password
2. **Master DB Check** - Check admin registry first
3. **Tenant DB Search** - Search all tenant databases for teachers/students
4. **Token Generation** - Create JWT with user info and database name
5. **Response** - Return token and user profile

### Authorization Middleware
- **tenantAuth** - Validates JWT and connects to correct tenant database
- **adminAuth** - Ensures admin-only access to protected routes
- **roleAuth** - Role-based access control for specific operations

## 📊 Database Models & Schemas

### User Model (Tenant DB)
```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'teacher', 'student']),
  name: String,
  email: String,
  phone: String,
  address: String,
  classId: ObjectId (for students),
  rollNumber: String (for students),
  department: String (for teachers),
  employeeId: String (for teachers),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Class Model (Tenant DB)
```javascript
{
  name: String (required),
  grade: String (required),
  teacherId: ObjectId (ref: 'User'),
  studentIds: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Schedule Model (Tenant DB)
```javascript
{
  classId: ObjectId (ref: 'Class', required),
  teacherId: ObjectId (ref: 'User', required),
  subject: String (required),
  day: String (required),
  startTime: String (required),
  endTime: String (required),
  isRecurring: Boolean (default: false),
  academicYear: String,
  createdAt: Date
}
```

### Calendar Model (Tenant DB)
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  type: String (enum: ['national_holiday', 'admin_event']),
  isNational: Boolean (default: false),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date
}
```

### Message Model (Tenant DB)
```javascript
{
  senderId: ObjectId (ref: 'User', required),
  receiverId: ObjectId (ref: 'User', required),
  message: String (required),
  type: String (enum: ['text', 'audio'], default: 'text'),
  audioUrl: String,
  replyTo: ObjectId (ref: 'Message'),
  isRead: Boolean (default: false),
  readAt: Date,
  timestamp: Date (default: Date.now)
}
```

### Activity Log Model (Both Master & Tenant DBs)
```javascript
{
  userId: ObjectId (required),
  action: String (required),
  targetType: String (required),
  targetId: String,
  targetName: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date (default: Date.now)
}
```

## 🛣️ API Routes & Endpoints

### Authentication Routes (`/api/auth`)
- `POST /login` - User authentication
- `GET /me` - Get current user profile
- `DELETE /delete-account` - Delete user account

### User Management Routes (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /chat` - Get users for chat (role-based)
- `POST /` - Create new user (admin only)
- `PUT /:id` - Update user (admin only)
- `DELETE /:id` - Delete user (admin only)

### Class Management Routes (`/api/classes`)
- `GET /` - Get all classes
- `GET /my-classes` - Get teacher's classes
- `POST /` - Create class (admin only)
- `PUT /:id/assign-teacher` - Assign teacher to class
- `PUT /:id/add-student` - Add student to class
- `PUT /:id/remove-student` - Remove student from class
- `PUT /reassign-student` - Reassign student between classes
- `PUT /:id` - Update class
- `DELETE /:id` - Delete class

### Schedule Management Routes (`/api/schedules`)
- `GET /` - Get all schedules
- `GET /class/:classId` - Get class-specific schedules
- `GET /my-schedule` - Get teacher's personal schedule
- `POST /` - Create single schedule
- `POST /create-weekly` - Create weekly schedule
- `PUT /:id` - Update schedule
- `DELETE /` - Delete all schedules
- `DELETE /:id` - Delete specific schedule

### Calendar Routes (`/api/calendar`)
- `GET /` - Get all calendar events
- `GET /upcoming` - Get upcoming events (next 7 days)
- `POST /` - Create calendar event (admin only)
- `POST /init-holidays` - Initialize Indian national holidays
- `PUT /:id` - Update calendar event (admin only)
- `DELETE /:id` - Delete calendar event (admin only)

### Message Routes (`/api/messages`)
- `POST /send` - Send text message
- `POST /send-audio` - Send audio message
- `GET /:userId` - Get conversation with specific user
- `GET /unread/counts` - Get unread message counts

### Subject Management Routes (`/api/subjects`)
- `GET /` - Get all subjects
- `POST /` - Create subject (admin only)
- `PUT /:id/assign` - Assign teacher to subject
- `PUT /:id/unassign` - Unassign teacher from subject
- `DELETE /:id` - Delete subject

## 🔒 Security Implementation

### Password Security
- **bcryptjs** with salt rounds for password hashing
- **Password validation** on registration
- **Secure password storage** (never stored in plain text)

### JWT Security
- **Token expiration** management
- **Role-based token validation**
- **Database-specific token binding**
- **Secure token generation** with strong secrets

### Input Validation
- **Server-side validation** for all inputs
- **Data sanitization** to prevent injection attacks
- **Type checking** and format validation
- **Required field validation**

### CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📈 Comprehensive Activity Logging

### Dual Logging System

**Master Database Logging:**
- Admin account creation/deletion
- Database creation/cleanup
- Cross-tenant administrative actions
- System-wide security events

**Tenant Database Logging:**
- User management operations
- Class and schedule management
- Assignment operations
- Calendar event management
- Message activities
- Authentication events

### Logged Activities
- `CREATE_USER`, `UPDATE_USER`, `DELETE_USER`
- `CREATE_CLASS`, `UPDATE_CLASS`, `DELETE_CLASS`
- `CREATE_SCHEDULE`, `UPDATE_SCHEDULE`, `DELETE_SCHEDULE`
- `CREATE_CALENDAR_EVENT`, `UPDATE_CALENDAR_EVENT`, `DELETE_CALENDAR_EVENT`
- `SEND_MESSAGE`, `SEND_AUDIO_MESSAGE`
- `LOGIN`, `VIEW_PROFILE`
- `ASSIGN_TEACHER`, `ADD_STUDENT`, `REMOVE_STUDENT`

### Activity Log Structure
```javascript
{
  userId: "user_performing_action",
  action: "ACTION_TYPE",
  targetType: "resource_type",
  targetId: "resource_id",
  targetName: "resource_name",
  details: {
    // Specific action details
  },
  ipAddress: "client_ip",
  userAgent: "client_user_agent",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## 🤖 Auto Timetable Generator Algorithm

### Algorithm Logic
1. **Teacher-Class Analysis**: Identify teacher assignments
2. **Period Calculation**: Calculate optimal periods per class
3. **Conflict Detection**: Check for scheduling conflicts
4. **Break Enforcement**: Apply 2-period consecutive limit
5. **Distribution**: Evenly distribute across weekdays
6. **Subject Assignment**: Assign subjects based on grade levels
7. **Database Creation**: Store generated schedules

### Conflict Prevention
- **Teacher Availability**: Ensure no double-booking
- **Class Scheduling**: Prevent multiple subjects at same time
- **Break Management**: Automatic break insertion
- **Time Slot Validation**: Respect lunch break (12:00-12:30)

## 📁 File Upload Handling

### Multer Configuration
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `voice-${Date.now()}-${Math.round(Math.random() * 1E9)}.wav`;
    cb(null, uniqueName);
  }
});
```

### File Types Supported
- **Audio Messages**: WAV format for voice recordings
- **Assignment Attachments**: Multiple file types
- **Profile Images**: Image formats (future enhancement)

## 🌐 Environment Configuration

### Required Environment Variables
```bash
PORT=5001
MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NODE_ENV=development
```

### MongoDB Atlas Configuration
- **Connection String**: Includes authentication and cluster details
- **Database Selection**: Automatic based on JWT token
- **Connection Pooling**: Optimized for performance
- **Error Handling**: Graceful connection failure management

## 🚀 Deployment Considerations

### Production Setup
- **Environment Variables**: Secure production secrets
- **Database Indexing**: Optimize query performance
- **Error Logging**: Comprehensive error tracking
- **Performance Monitoring**: Track API response times
- **Security Headers**: Additional security middleware

### Scaling Considerations
- **Database Sharding**: For large number of tenants
- **Load Balancing**: Multiple server instances
- **Caching**: Redis for session management
- **CDN**: For static file delivery

## 🔧 Development Setup

### Installation
```bash
cd backend
npm install
```

### Development Server
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Testing
```bash
npm test     # Run test suite
npm run test:watch  # Watch mode for development
```

### Code Quality
```bash
npm run lint     # ESLint checking
npm run format   # Prettier formatting
```

## ⚡ Performance Optimizations

### Database Optimizations
- **Indexing**: Strategic indexes on frequently queried fields
- **Aggregation Pipelines**: Efficient data processing
- **Connection Pooling**: Reuse database connections
- **Query Optimization**: Minimize database round trips

### API Optimizations
- **Middleware Ordering**: Optimize request processing
- **Response Compression**: Reduce payload sizes
- **Caching Headers**: Browser and proxy caching
- **Rate Limiting**: Prevent API abuse

## 🐛 Error Handling

### Error Types
- **Validation Errors**: Input validation failures
- **Authentication Errors**: Invalid credentials or tokens
- **Authorization Errors**: Insufficient permissions
- **Database Errors**: Connection or query failures
- **File Upload Errors**: File processing issues

### Error Response Format
```javascript
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

## 📝 API Documentation

### Response Formats
**Success Response:**
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error Response:**
```javascript
{
  "success": false,
  "message": "Error message",
  "error": { /* error details */ }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

**Backend Architecture designed for scalability, security, and maintainability** 🚀