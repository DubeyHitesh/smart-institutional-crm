# Smart Institutional CRM - Backend Setup

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

### 1. Install MongoDB
**Windows:**
- Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Alternative: Use MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/atlas
- Create cluster and get connection string
- Update `.env` file with your connection string

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
```bash
# In main directory
npm start
```

## Backend Features Implemented

### 🔐 **Authentication**
- JWT token-based authentication
- Secure password hashing with bcrypt
- Role-based access control

### 👥 **User Management**
- CRUD operations for users
- Profile updates
- Admin-only user creation/deletion

### 🏫 **Class Management**
- Create classes
- Assign teachers to classes
- Add students to classes
- View assigned classes (teachers)

### 📅 **Schedule Management**
- Create schedules for classes
- Assign teachers to time slots
- View personal schedules (teachers)

### 🛡️ **Security**
- Protected routes with JWT middleware
- Admin-only endpoints
- Input validation

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/profile` - Update own profile
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/my-classes` - Get teacher's classes
- `POST /api/classes` - Create class (admin)
- `PUT /api/classes/:id/assign-teacher` - Assign teacher (admin)
- `PUT /api/classes/:id/add-student` - Add student (admin)
- `DELETE /api/classes/:id` - Delete class (admin)

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/my-schedule` - Get teacher's schedule
- `POST /api/schedules` - Create schedule (admin)
- `PUT /api/schedules/:id` - Update schedule (admin)
- `DELETE /api/schedules/:id` - Delete schedule (admin)

## Default Credentials
- **Admin**: username: `admin`, password: `admin123`

## Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-crm
JWT_SECRET=your-super-secret-jwt-key-here
```

## Database Schema

### Users Collection
- username, password, role, name, email, phone, address
- class, rollNumber (students)
- department, employeeId (teachers)

### Classes Collection
- name, grade, teacherId, studentIds[]

### Schedules Collection
- classId, teacherId, subject, day, startTime, endTime

## Next Steps
1. Start MongoDB service
2. Run `npm run dev` in backend directory
3. Run `npm start` in main directory
4. Login with admin credentials
5. Create users, classes, and schedules

The system now has full backend integration with persistent data storage!