# 🎓 Smart Institutional CRM - Complete Educational Management System

> **A comprehensive full-stack CRM system for educational institutions with multi-tenant architecture, role-based access control, real-time messaging, calendar management, auto timetable generation, and advanced assignment management.**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Key Features Overview

### 🎨 Modern UI/UX Design
- **3D Landing Page** with CSS animations and glass morphism effects
- **Purple/Pink Gradient Theme** throughout the application
- **Bottom Navigation Bar** with role-based menu items and notification dots
- **Responsive Design** with mobile-friendly interface
- **Glass Morphism Components** with backdrop blur effects
- **Interactive Animations** and smooth transitions
- **Color-coded Visual Indicators** (green for holidays, red for events)

### 🏢 Multi-Tenant Architecture
- **Separate Databases** for each admin/institution (`smart_crm_[username]_[timestamp]`)
- **Master Database** tracking all admin registrations (`smart_crm_master`)
- **Automatic Database Creation** with unique naming convention
- **Cross-Database Authentication** for teachers and students
- **Database Cleanup** when admin accounts are deleted
- **MongoDB Atlas Cloud Integration** for multi-device access

### 👥 Advanced User Management
- **Role-Based Access Control** (Admin, Teacher, Student)
- **Secure Registration System** for new institutions
- **Profile Management** with role-specific fields
- **Class Assignment Display** in student profiles
- **Teacher-Class Assignment Validation**
- **User Activity Tracking** with comprehensive logging

### 📚 Comprehensive Class Management
- **Dynamic Class Creation** with grade levels (1st-12th)
- **Teacher Assignment** with conflict prevention
- **Student Allotment System** with reassignment capabilities
- **Real-time Student Counting** in classes
- **Class-based Schedule Management**
- **Grade-wise Filtering** and sorting options

### 📝 Advanced Assignment System
- **Assignment Creation** by teachers for multiple classes
- **File Attachment Support** for both teachers and students
- **Submission Management** with file upload capabilities
- **Accept/Reject Workflow** for teacher review
- **Grading System** with marks and feedback
- **Assignment Reassignment** for resubmission requests
- **Overdue Detection** with visual indicators
- **Submission Status Tracking** (Pending, Submitted, Overdue, Graded)
- **Performance Analytics** based on assignment grades

### 📅 Smart Schedule Management
- **Weekly Schedule Creation** by admins
- **Conflict Detection** for teachers and classes
- **Auto Timetable Generator** with intelligent algorithms
- **Teacher Break Management** (automatic 2-period break enforcement)
- **Lunch Break Integration** (12:00-12:30)
- **Time Slot Management** (9:00 AM - 2:30 PM)
- **Class-specific Schedule Display**
- **Configurable Periods** (1-10 per day, 1-15 per week)

### 🤖 Auto Timetable Generator
- **Intelligent Schedule Generation** for teachers and classes
- **Conflict Prevention** with automatic detection
- **Subject Assignment Integration** based on teacher expertise
- **Balanced Workload Distribution** across days
- **Customizable Parameters** (max periods per day/week)
- **Grade-based Subject Assignment**
- **Teacher Selection Options** (individual or bulk)

### 💬 Personal Chat System
- **WhatsApp-style Interface** with modern design
- **Real-time Messaging** between teachers and students
- **Message Reply Functionality** with thread support
- **Emoji Picker Integration** for expressive communication
- **Unread Message Notifications** with count badges
- **Sender Name Display** for clear identification
- **Audio Message Support** with voice recording

### 📊 Performance Analytics
- **Real-time Performance Tracking** based on assignment grades
- **Student Dashboard** with dynamic statistics
- **Teacher Performance Analytics** showing class-wide metrics
- **Grade Distribution Charts** using Recharts
- **Progress Visualization** with trend analysis
- **Completion Rate Tracking**
- **Average Score Calculations**

### 📅 Calendar System with Indian Holidays
- **Monthly Calendar Grid** with intuitive navigation
- **Predefined Indian National Holidays** (2024-2026)
  - Republic Day, Independence Day, Diwali, Holi, Gandhi Jayanti, etc.
- **Admin Event Management** (create, edit, delete)
- **Color-coded Highlighting** (green for holidays, red for admin events)
- **Month/Year Dropdown Navigation**
- **Event CRUD Operations** with role-based permissions
- **Holiday Initialization** with automatic setup

### 📢 Notice & Communication System
- **Admin-to-User Notices** with role-based targeting
- **Unread Notification Indicators** in navigation
- **Notice Management** with creation and deletion
- **Automatic Assignment Notifications** when assignments are posted
- **Real-time Updates** across all user types

### 📈 Comprehensive Activity Logging
- **Complete Audit Trail** for all system operations
- **Dual Logging System**:
  - **Master Database Logging** for cross-tenant tracking
  - **Tenant Database Logging** for institution-specific activities
- **Detailed Activity Capture**:
  - User creation, updates, deletions
  - Class management operations
  - Schedule creation, updates, deletions
  - Calendar event management
  - Message sending (text and audio)
  - Authentication activities (login, profile views)
  - Subject management operations
- **IP Address and User Agent Tracking**
- **Timestamp Recording** for all activities
- **Non-critical Logging** (system continues if logging fails)

## 🛠 Technology Stack & Architecture

### Frontend Technologies
- **React.js 18** with TypeScript for type safety
- **Styled Components** with transient props for CSS-in-JS
- **React Router DOM** for client-side routing
- **React Context API** with useReducer for state management
- **Recharts** for interactive data visualization and charts
- **CSS3** with animations, transitions, and glass morphism effects

### Backend Technologies
- **Node.js** (v14+) with Express.js framework
- **MongoDB Atlas** cloud database with multi-tenant support
- **Mongoose ODM** for database operations
- **JWT (jsonwebtoken)** for authentication and authorization
- **bcryptjs** for secure password hashing
- **CORS** middleware for cross-origin resource sharing
- **Multer** for file upload handling
- **dotenv** for environment variable management

### Database Architecture
- **Master Database**: `smart_crm_master`
  - Admin registry and cross-tenant activity logs
  - Centralized user tracking and management
- **Tenant Databases**: `smart_crm_[username]_[timestamp]`
  - Institution-specific data isolation
  - Users, classes, schedules, assignments, messages
  - Local activity logs and audit trails

### Security Features
- **JWT Token-based Authentication** with role validation
- **Multi-tenant Data Isolation** with separate databases
- **Password Hashing** with bcryptjs salt rounds
- **Input Validation** and sanitization
- **CORS Configuration** for secure API access
- **Activity Logging** for security auditing

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (cloud database)
- Git for version control
- VS Code (recommended) with extensions

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5001" > .env
echo "MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster" >> .env
echo "JWT_SECRET=your-super-secret-jwt-key-here-change-in-production" >> .env

# Start backend server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory (root)
npm install

# Start development server
npm start
```

### Access the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **MongoDB Atlas**: Cloud-hosted database

## 👤 User Roles & Comprehensive Permissions

### 🔧 Administrator (Super User)
**Complete System Control**
- **User Management**: Create, update, delete teachers and students
- **Class Management**: Create classes, assign teachers, manage students
- **Schedule Management**: Create weekly schedules, manage timetables
- **Auto Timetable**: Generate intelligent schedules with conflict detection
- **Calendar Management**: Create, edit, delete events and holidays
- **Notice Distribution**: Send targeted notices to users
- **Activity Monitoring**: View comprehensive audit logs
- **Database Management**: Full control over tenant database
- **System Configuration**: Manage all system settings

**Key Features:**
- Multi-tenant database creation and management
- Cross-database user authentication
- Comprehensive activity logging and monitoring
- Institution-wide analytics and reporting

### 👨🏫 Teacher (Educator)
**Classroom & Student Management**
- **Class Overview**: View assigned classes and student lists
- **Assignment Management**: Create, update, delete assignments
- **Submission Review**: Accept/reject student submissions
- **Grading System**: Grade assignments with feedback
- **Performance Analytics**: View class and student performance
- **Personal Chat**: Communicate with students via messaging
- **Schedule Access**: View personal teaching schedule
- **Calendar Access**: View institutional calendar and events

**Assignment Workflow:**
1. Create assignments for multiple classes simultaneously
2. Attach reference materials and instructions
3. Monitor student submissions in real-time
4. Review and accept/reject submissions
5. Grade accepted work with detailed feedback
6. Reassign work for improvement if needed
7. Track class performance analytics

### 👨🎓 Student (Learner)
**Learning & Communication Management**
- **Profile Management**: View personal profile with class assignment
- **Assignment Dashboard**: Access all assignments with status tracking
- **Submission System**: Submit assignments with file attachments
- **Grade Tracking**: View marks and teacher feedback
- **Performance Analytics**: Personal performance dashboard
- **Personal Chat**: Communicate with teachers
- **Schedule Access**: View class timetable and schedule
- **Calendar Access**: View institutional events and holidays

**Assignment Experience:**
- Real-time assignment notifications
- File attachment capabilities for submissions
- Overdue detection with visual warnings
- Grade and feedback viewing
- Resubmission for reassigned work
- Personal performance tracking

## 📋 Detailed Feature Breakdown

### 🤖 Auto Timetable Generator Logic
**Intelligent Algorithm Features:**
- **Conflict Detection**: Prevents teacher and class scheduling conflicts
- **Break Management**: Enforces 2-period consecutive limit with automatic breaks
- **Workload Distribution**: Evenly distributes periods across the week
- **Subject Integration**: Assigns subjects based on teacher expertise
- **Grade-based Logic**: Different subjects for different grade levels
- **Customizable Parameters**: 1-10 periods per day, 1-15 per week
- **Bulk Generation**: Generate schedules for multiple teachers/classes

**Algorithm Workflow:**
1. Analyze teacher-class assignments
2. Calculate optimal periods per class
3. Distribute periods across weekdays
4. Apply break rules and conflict checks
5. Generate balanced weekly schedules
6. Create database entries with logging

### 💬 Personal Chat System Architecture
**WhatsApp-style Features:**
- **Real-time Messaging**: Instant message delivery
- **Message Threading**: Reply to specific messages
- **Emoji Integration**: Express emotions with emojis
- **Unread Counters**: Track unread messages per conversation
- **Sender Identification**: Clear sender name display
- **Audio Messages**: Voice recording and playback
- **Message Status**: Delivery and read receipts

**Technical Implementation:**
- RESTful API for message operations
- File upload handling for audio messages
- Real-time updates via polling
- Unread count aggregation
- Message threading with reply references

### 📅 Calendar System with Indian Holidays
**Comprehensive Holiday Management:**
- **Predefined Holidays**: 36+ Indian national holidays (2024-2026)
- **Holiday Categories**: National holidays, religious festivals
- **Admin Events**: Custom institutional events
- **Visual Indicators**: Color-coded highlighting system
- **CRUD Operations**: Full event management capabilities
- **Role-based Access**: Admin create/edit, all users view

**Included Indian Holidays:**
- Republic Day (Jan 26), Independence Day (Aug 15)
- Gandhi Jayanti (Oct 2), Christmas (Dec 25)
- Diwali, Holi, Dussehra, Janmashtami
- Guru Nanak Jayanti, Ram Navami, Good Friday
- And many more across 2024-2026

### 📊 Performance Analytics Engine
**Student Analytics:**
- **Average Score**: Calculated from all graded assignments
- **Completion Rate**: Percentage of assignments completed
- **Pending Work**: Count of unsubmitted assignments
- **Grade Distribution**: Visual representation of performance
- **Trend Analysis**: Performance over time

**Teacher Analytics:**
- **Class Performance**: Overview of student achievements
- **Assignment Statistics**: Submission and grading metrics
- **Student Progress**: Individual and group tracking
- **Performance Comparisons**: Cross-class analytics

### 📈 Comprehensive Activity Logging System
**Dual Logging Architecture:**

**Master Database Logs:**
- Admin account creation and deletion
- Cross-tenant administrative actions
- System-wide security events
- Database creation and management

**Tenant Database Logs:**
- User management (create, update, delete)
- Class operations (create, assign, modify)
- Schedule management (create, update, delete)
- Calendar events (create, edit, delete)
- Message activities (send text/audio)
- Authentication events (login, profile access)
- Assignment operations (create, grade, submit)

**Logged Information:**
- **User Details**: ID, username, role
- **Action Type**: CREATE, UPDATE, DELETE, VIEW, LOGIN
- **Target Information**: Type, ID, name of affected resource
- **Metadata**: IP address, user agent, timestamp
- **Details**: Specific data changes and context

## 🔧 Development Guidelines & Best Practices

### Code Structure
```
src/
├── components/              # Reusable UI components
│   ├── Navigation.tsx       # Bottom navigation with notifications
│   ├── DashboardLayout.tsx  # Main layout wrapper
│   ├── TeacherAssignments.tsx # Assignment management
│   ├── StudentAssignments.tsx # Student assignment view
│   ├── AutoTimetableGenerator.tsx # Intelligent scheduling
│   ├── PersonalChat.tsx     # WhatsApp-style messaging
│   ├── Calendar.tsx         # Calendar with Indian holidays
│   └── ...                  # Other components
├── context/                 # React Context for state management
│   └── AppContext.tsx       # Global application state
├── pages/                   # Main application pages
│   ├── NewLandingPage.tsx   # 3D landing page
│   └── ...                  # Role-specific dashboards
├── services/                # API communication
│   └── api.js               # Centralized API service
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions

backend/
├── models/                  # MongoDB schemas
│   ├── AdminRegistry.js     # Master admin tracking
│   ├── User.js              # User management
│   ├── Class.js             # Class structure
│   ├── Schedule.js          # Schedule management
│   ├── Calendar.js          # Calendar events
│   ├── Message.js           # Chat messages
│   ├── ActivityLog.js       # Activity logging
│   └── ...                  # Other models
├── routes/                  # API endpoints
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── classes.js           # Class management
│   ├── schedules.js         # Schedule handling
│   ├── calendar.js          # Calendar operations
│   ├── messages.js          # Chat functionality
│   └── ...                  # Other routes
├── middleware/              # Custom middleware
│   ├── tenantAuth.js        # Multi-tenant authentication
│   └── activityLogger.js    # Comprehensive activity logging
├── utils/                   # Backend utilities
│   └── DatabaseManager.js  # Multi-tenant DB manager
└── server.js                # Express server configuration
```

### Development Best Practices
- **TypeScript**: Strong typing for better code quality
- **Styled Components**: Component-scoped styling with transient props
- **Error Handling**: Comprehensive error management
- **Code Splitting**: Optimized bundle sizes
- **Performance Optimization**: Lazy loading and memoization
- **Activity Logging**: Every operation tracked for audit
- **Security**: JWT tokens, input validation, CORS configuration

## 🚀 Deployment & Production

### Production Build
```bash
# Frontend build
npm run build

# Backend production
NODE_ENV=production npm start
```

### Environment Variables
```bash
# Backend .env
PORT=5001
MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Database Considerations
- **MongoDB Atlas**: Cloud-hosted for scalability
- **Database Indexing**: Optimized query performance
- **Backup Strategy**: Automated cloud backups
- **Monitoring**: Performance and usage tracking

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Component Documentation**: Clear prop interfaces
- **Git Conventions**: Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and API documentation
- **Community**: Developer community support

### Troubleshooting
- **Database Connection**: Ensure MongoDB Atlas connection string is correct
- **Port Conflicts**: Check if ports 3000/5001 are available
- **CORS Issues**: Verify backend CORS configuration
- **Authentication**: Check JWT token validity and expiration

---

**Built with ❤️ for Educational Institutions**

*Smart Institutional CRM - Empowering Education Through Technology*

**🌟 Features Summary:**
- ✅ Multi-tenant Architecture with MongoDB Atlas
- ✅ Role-based Access Control (Admin/Teacher/Student)
- ✅ Auto Timetable Generator with Intelligent Algorithms
- ✅ Personal Chat System with WhatsApp-style Interface
- ✅ Calendar System with Indian National Holidays
- ✅ Comprehensive Assignment Management
- ✅ Performance Analytics with Visual Charts
- ✅ Complete Activity Logging & Audit Trails
- ✅ Modern UI with Glass Morphism Design
- ✅ Bottom Navigation with Notification System
- ✅ Responsive Design for All Devices
- ✅ Real-time Updates and Notifications