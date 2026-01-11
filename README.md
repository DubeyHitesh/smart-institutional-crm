# Smart Institutional CRM

A comprehensive full-stack CRM system for educational institutions with multi-tenant architecture, role-based access control, and advanced assignment management for administrators, teachers, and students.

## 🌟 Key Features Overview

### 🎨 Modern UI/UX
- **3D Landing Page** with CSS animations and glass morphism effects
- **Purple/Pink Gradient Theme** throughout the application
- **Responsive Design** with mobile-friendly navigation
- **Glass Morphism Components** with backdrop blur effects
- **Interactive Animations** and smooth transitions

### 🏢 Multi-Tenant Architecture
- **Separate Databases** for each admin/institution
- **Master Database** tracking all admin registrations
- **Automatic Database Creation** with unique naming convention
- **Cross-Database Authentication** for teachers and students
- **Database Cleanup** when admin accounts are deleted

### 👥 Advanced User Management
- **Role-Based Access Control** (Admin, Teacher, Student)
- **Secure Registration System** for new institutions
- **Profile Management** with role-specific fields
- **Class Assignment Display** in student profiles
- **Teacher-Class Assignment Validation**

### 📚 Comprehensive Class Management
- **Dynamic Class Creation** with grade levels
- **Teacher Assignment** with conflict prevention
- **Student Allotment System** with reassignment capabilities
- **Real-time Student Counting** in classes
- **Class-based Schedule Management**

### 📝 Advanced Assignment System
- **Assignment Creation** by teachers for multiple classes
- **File Attachment Support** for both teachers and students
- **Submission Management** with file upload capabilities
- **Accept/Reject Workflow** for teacher review
- **Grading System** with marks and feedback
- **Assignment Reassignment** for resubmission requests
- **Overdue Detection** with visual indicators
- **Submission Status Tracking** (Pending, Submitted, Overdue, Graded)

### 📅 Smart Schedule Management
- **Weekly Schedule Creation** by admins
- **Conflict Detection** for teachers and classes
- **Automatic Timetable Generation** for teachers and students
- **Lunch Break Integration** (12:00-12:30)
- **Time Slot Management** (9:00 AM - 2:30 PM)
- **Class-specific Schedule Display**

### 📊 Performance Analytics
- **Real-time Performance Tracking** based on assignment grades
- **Student Dashboard** with dynamic statistics
- **Teacher Performance Analytics** showing class-wide metrics
- **Grade Distribution Charts** using Recharts
- **Progress Visualization** with trend analysis
- **Completion Rate Tracking**

### 📢 Notice & Communication System
- **Admin-to-User Notices** with role-based targeting
- **Unread Notification Indicators** in navigation
- **Notice Management** with creation and deletion
- **Automatic Assignment Notifications** when assignments are posted

### 📈 Activity Logging & Audit
- **Comprehensive Activity Logging** for all admin actions
- **Master Database Logging** for cross-tenant tracking
- **Tenant Database Logging** for institution-specific activities
- **IP Address and User Agent Tracking**
- **Detailed Audit Trails** for compliance

## 🛠 Technology Stack & Development Tools

### Frontend Technologies
- **React.js 18** with TypeScript
- **Styled Components** with transient props for CSS-in-JS
- **React Router DOM** for client-side routing
- **React Context API** with useReducer for state management
- **Recharts** for interactive data visualization and charts
- **CSS3** with animations, transitions, and glass morphism effects

### Backend Technologies
- **Node.js** (v14+) with Express.js framework
- **MongoDB** with Mongoose ODM for database operations
- **JWT (jsonwebtoken)** for authentication and authorization
- **bcryptjs** for secure password hashing
- **CORS** middleware for cross-origin resource sharing
- **dotenv** for environment variable management

### Development Tools & Extensions

#### Code Editor & Extensions (VS Code Recommended)
- **ES7+ React/Redux/React-Native snippets** - Code snippets for React development
- **TypeScript Importer** - Auto import TypeScript modules
- **Prettier - Code formatter** - Consistent code formatting
- **ESLint** - JavaScript/TypeScript linting
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **Bracket Pair Colorizer** - Colorize matching brackets
- **GitLens** - Enhanced Git capabilities
- **Thunder Client** - API testing (alternative to Postman)
- **MongoDB for VS Code** - MongoDB database management

#### Package Managers & Build Tools
- **npm** - Node package manager
- **Create React App** - React application bootstrapping
- **Webpack** (via CRA) - Module bundling and build optimization
- **Babel** (via CRA) - JavaScript transpilation

#### Database & Storage
- **MongoDB Community Server** - NoSQL database
- **MongoDB Compass** - GUI for MongoDB database management
- **LocalStorage API** - Client-side data persistence

#### Version Control & Collaboration
- **Git** - Version control system
- **GitHub** - Code repository hosting

### External APIs & Libraries

#### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "styled-components": "^5.3.6",
  "recharts": "^2.5.0",
  "typescript": "^4.9.4",
  "@types/react": "^18.0.27",
  "@types/react-dom": "^18.0.10",
  "@types/styled-components": "^5.1.26"
}
```

#### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^6.8.4",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "nodemon": "^2.0.20"
}
```

#### Browser APIs Used
- **Fetch API** - HTTP requests to backend
- **LocalStorage API** - Client-side data persistence
- **File API** - File upload and attachment handling
- **Date API** - Date/time operations and formatting

#### CSS Features & Techniques
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Custom Properties** - Dynamic theming
- **CSS Animations & Transitions** - Smooth interactions
- **Backdrop Filter** - Glass morphism effects
- **Media Queries** - Responsive design
- **CSS Gradients** - Purple/pink theme implementation

### Development Environment Setup

#### Required Software
1. **Node.js** (v14 or higher) - JavaScript runtime
2. **MongoDB Community Server** - Database server
3. **Git** - Version control
4. **VS Code** (recommended) - Code editor
5. **MongoDB Compass** (optional) - Database GUI

#### Optional Tools
- **Postman** or **Thunder Client** - API testing
- **React Developer Tools** - Browser extension for React debugging
- **Redux DevTools** - State management debugging (if using Redux)
- **MongoDB Atlas** - Cloud database (for production)

### Architecture Patterns Used

#### Frontend Patterns
- **Component-Based Architecture** - Reusable UI components
- **Container/Presentational Pattern** - Separation of logic and UI
- **Context Provider Pattern** - Global state management
- **Higher-Order Components** - Component composition
- **Custom Hooks Pattern** - Reusable stateful logic

#### Backend Patterns
- **MVC Architecture** - Model-View-Controller separation
- **Middleware Pattern** - Request/response processing
- **Repository Pattern** - Data access abstraction
- **Multi-tenant Architecture** - Database per tenant
- **JWT Authentication Pattern** - Stateless authentication

#### Database Patterns
- **Multi-tenant Database Design** - Separate databases per institution
- **Master-Tenant Pattern** - Central registry with isolated tenants
- **Activity Logging Pattern** - Comprehensive audit trails
- **Referential Integrity** - Proper data relationships

### Performance Optimizations

#### Frontend Optimizations
- **Code Splitting** - Lazy loading of components
- **Memoization** - React.memo for component optimization
- **Virtual DOM** - Efficient rendering with React
- **Bundle Optimization** - Webpack optimizations via CRA
- **Image Optimization** - Proper image formats and sizing

#### Backend Optimizations
- **Database Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Middleware Optimization** - Streamlined request processing
- **Error Handling** - Graceful error management
- **CORS Optimization** - Specific origin configuration

### Database Architecture
- **Master Database**: `smart_crm_master`
  - Admin registry and activity logs
  - Cross-tenant user tracking
- **Tenant Databases**: `smart_crm_[username]_[timestamp]`
  - Institution-specific data
  - Users, classes, schedules, assignments

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart_crm
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Start MongoDB service
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

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
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)

## 👤 User Roles & Permissions

### 🔧 Administrator
**Full System Control**
- Create and manage teacher/student accounts
- Class creation and management
- Student allotment and reassignment
- Schedule creation and management
- Notice distribution
- Activity monitoring and reports
- Database management

**Key Features:**
- Multi-tenant database creation
- Cross-database user management
- Comprehensive activity logging
- Institution-wide analytics

### 👨‍🏫 Teacher
**Classroom Management**
- View assigned classes and students
- Create and manage assignments
- Review student submissions
- Accept/reject student work
- Grade assignments with feedback
- Reassign work for resubmission
- View class performance analytics
- Access personal schedule

**Assignment Workflow:**
1. Create assignment for multiple classes
2. Students receive automatic notifications
3. Review submitted attachments
4. Accept or reject submissions
5. Grade accepted work
6. Optionally reassign for improvement

### 👨‍🎓 Student
**Learning Management**
- View personal profile with assigned class
- Access assignment dashboard
- Submit assignments with file attachments
- Track submission status and grades
- View personal performance analytics
- Access class schedule and timetable
- Receive notices and updates

**Assignment Experience:**
- Real-time assignment notifications
- File attachment capabilities
- Overdue detection with visual warnings
- Grade and feedback viewing
- Resubmission for reassigned work

## 📋 Detailed Feature Breakdown

### Assignment Management System

#### For Teachers:
- **Multi-Class Assignment**: Create assignments for multiple classes simultaneously
- **File Attachments**: Attach reference materials and instructions
- **Submission Review**: View all student submissions in organized interface
- **File Viewing**: Click to open and review student attachments
- **Accept/Reject Workflow**: Review submissions before grading
- **Grading Interface**: Assign marks with maximum score settings
- **Reassignment Feature**: Send work back for improvement
- **Performance Analytics**: View class-wide performance metrics

#### For Students:
- **Assignment Dashboard**: View all assigned work with status indicators
- **File Upload**: Attach completed work and supporting documents
- **Deadline Tracking**: Visual indicators for due dates and overdue work
- **Submission Status**: Track progress from pending to graded
- **Grade Viewing**: See marks and feedback from teachers
- **Resubmission**: Ability to resubmit reassigned work
- **Performance Tracking**: Personal analytics based on grades

### Schedule Management System

#### Time Structure:
- **Morning Sessions**: 9:00 AM - 12:00 PM
- **Lunch Break**: 12:00 PM - 12:30 PM (highlighted)
- **Afternoon Sessions**: 12:30 PM - 2:30 PM
- **Hourly Intervals**: 1-hour time slots for optimal scheduling

#### Features:
- **Conflict Prevention**: Automatic detection of teacher/class conflicts
- **Visual Schedule Grid**: Interactive timetable display
- **Role-based Views**: Different perspectives for admins, teachers, and students
- **Class Integration**: Schedules automatically appear for assigned students

### Performance Analytics

#### Student Analytics:
- **Average Score**: Calculated from all graded assignments
- **Completion Rate**: Percentage of assignments completed
- **Pending Work**: Count of unsubmitted assignments
- **Grade Distribution**: Visual representation of performance

#### Teacher Analytics:
- **Class Performance**: Overview of student achievements
- **Assignment Statistics**: Submission and grading metrics
- **Student Progress**: Individual and group performance tracking

## 🔐 Security Features

### Authentication & Authorization
- **JWT Token-based Authentication**
- **Role-based Access Control (RBAC)**
- **Password Hashing** with bcryptjs
- **Cross-tenant Security** with database isolation
- **Session Management** with automatic token refresh

### Data Protection
- **Multi-tenant Isolation**: Complete data separation between institutions
- **Activity Logging**: Comprehensive audit trails
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin resource sharing

## 📱 Responsive Design

### Mobile Optimization
- **Responsive Navigation**: Collapsible sidebar for mobile devices
- **Touch-friendly Interface**: Optimized for touch interactions
- **Adaptive Layouts**: Flexible grid systems for all screen sizes
- **Mobile-first Approach**: Progressive enhancement for larger screens

### Cross-browser Compatibility
- **Modern Browser Support**: Chrome, Firefox, Safari, Edge
- **CSS Grid and Flexbox**: Modern layout techniques
- **Polyfills**: Backward compatibility where needed

## 🔧 Development Guidelines

### Code Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Responsive sidebar navigation
│   ├── DashboardLayout.tsx # Main layout wrapper
│   ├── TeacherAssignments.tsx # Assignment management
│   ├── StudentAssignments.tsx # Student assignment view
│   └── ...             # Other components
├── context/            # React Context for state management
│   └── AppContext.tsx  # Global application state
├── pages/              # Main application pages
│   ├── NewLandingPage.tsx # 3D landing page
│   └── ...             # Role-specific dashboards
├── services/           # API communication
│   └── api.js          # Centralized API service
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

backend/
├── models/             # MongoDB schemas
│   ├── AdminRegistry.js # Master admin tracking
│   ├── User.js         # User management
│   ├── Class.js        # Class structure
│   └── ...             # Other models
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── classes.js      # Class management
│   ├── assignments.js  # Assignment handling
│   └── ...             # Other routes
├── middleware/         # Custom middleware
│   ├── tenantAuth.js   # Multi-tenant authentication
│   └── activityLogger.js # Activity logging
├── utils/              # Backend utilities
│   └── DatabaseManager.js # Multi-tenant DB manager
└── server.js           # Express server configuration
```

### Best Practices
- **TypeScript**: Strong typing for better code quality
- **Styled Components**: Component-scoped styling with transient props
- **Error Handling**: Comprehensive error management
- **Code Splitting**: Optimized bundle sizes
- **Performance Optimization**: Lazy loading and memoization

## 🚀 Deployment

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
MONGODB_URI=mongodb://localhost:27017/smart_crm
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Database Considerations
- **MongoDB Atlas**: Recommended for production
- **Database Indexing**: Optimize query performance
- **Backup Strategy**: Regular automated backups
- **Monitoring**: Database performance monitoring

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
- **Database Connection**: Ensure MongoDB is running
- **Port Conflicts**: Check if ports 3000/5001 are available
- **CORS Issues**: Verify backend CORS configuration
- **Authentication**: Check JWT token validity

---

**Built with ❤️ for Educational Institutions**

*Smart Institutional CRM - Empowering Education Through Technology*