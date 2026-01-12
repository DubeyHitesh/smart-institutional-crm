# Comprehensive Testing Plan for Smart Institutional CRM

## Prerequisites for All Tests
- Backend server running on port 5001
- Frontend running on port 3000
- MongoDB Atlas connection established
- At least one admin account registered
- Test data: sample users, classes, subjects, schedules, assignments, etc. created

## 1. Authentication

### Test Case 1.1: Successful Admin Login
- **What to test**: User login with valid admin credentials
- **How to test**: UI - Navigate to login page, enter valid username/password, click login
- **Expected outcomes**: Successful login, redirect to admin dashboard, JWT token stored in localStorage
- **Prerequisites**: Admin user exists in master database

### Test Case 1.2: Successful Teacher Login
- **What to test**: User login with valid teacher credentials
- **How to test**: UI - Enter teacher credentials on login page
- **Expected outcomes**: Login success, redirect to teacher dashboard
- **Prerequisites**: Teacher user exists in tenant database

### Test Case 1.3: Successful Student Login
- **What to test**: User login with valid student credentials
- **How to test**: UI - Enter student credentials on login page
- **Expected outcomes**: Login success, redirect to student dashboard
- **Prerequisites**: Student user exists in tenant database

### Test Case 1.4: Failed Login - Invalid Password
- **What to test**: Login attempt with wrong password
- **How to test**: UI - Enter valid username, invalid password, click login
- **Expected outcomes**: Error message "Invalid credentials", user not logged in
- **Prerequisites**: Valid user exists

### Test Case 1.5: Failed Login - Non-existent User
- **What to test**: Login attempt with non-existent username
- **How to test**: UI - Enter invalid username, any password, click login
- **Expected outcomes**: Error message "User not found"
- **Prerequisites**: None

### Test Case 1.6: Logout Functionality
- **What to test**: User logout process
- **How to test**: UI - While logged in, click logout button in navigation
- **Expected outcomes**: User logged out, redirected to login page, JWT token removed from storage
- **Prerequisites**: User logged in

### Test Case 1.7: JWT Token Validation
- **What to test**: Access to protected API routes with valid token
- **How to test**: API - Use Postman to send authenticated request to protected endpoint
- **Expected outcomes**: 200 OK response, data returned
- **Prerequisites**: Valid JWT token obtained

### Test Case 1.8: Unauthorized Access
- **What to test**: Access to protected routes without authentication
- **How to test**: API - Send request to protected endpoint without Authorization header
- **Expected outcomes**: 401 Unauthorized response
- **Prerequisites**: None

### Test Case 1.9: Role-Based Access Control
- **What to test**: Access control based on user role
- **How to test**: API - Use student token to access admin-only endpoint
- **Expected outcomes**: 403 Forbidden response
- **Prerequisites**: Student user logged in, admin endpoint exists

## 2. User Management

### Test Case 2.1: Create New Teacher (Admin)
- **What to test**: Admin creating a new teacher user
- **How to test**: UI - Admin dashboard > User Management > Add Teacher form
- **Expected outcomes**: Teacher user created, appears in user list, activity logged in database
- **Prerequisites**: Admin logged in

### Test Case 2.2: Create New Student (Admin)
- **What to test**: Admin creating a new student user
- **How to test**: UI - Admin dashboard > User Management > Add Student form, assign to class
- **Expected outcomes**: Student user created, assigned to specified class
- **Prerequisites**: Admin logged in, class exists

### Test Case 2.3: Update User Profile (Teacher)
- **What to test**: Teacher updating their own profile information
- **How to test**: UI - Teacher dashboard > Profile > Edit profile details
- **Expected outcomes**: Profile information updated successfully
- **Prerequisites**: Teacher logged in

### Test Case 2.4: Delete User (Admin)
- **What to test**: Admin deleting an existing user
- **How to test**: UI - Admin dashboard > User Management > Select user > Delete
- **Expected outcomes**: User removed from system, activity logged
- **Prerequisites**: Admin logged in, user exists

### Test Case 2.5: View User List (Admin)
- **What to test**: Admin viewing list of all users
- **How to test**: UI - Admin dashboard > User Management page
- **Expected outcomes**: List of all users with roles, names, and actions displayed
- **Prerequisites**: Admin logged in, users exist

## 3. Class/Subject/Schedule Management

### Test Case 3.1: Create New Class (Admin)
- **What to test**: Admin creating a new class
- **How to test**: UI - Admin dashboard > Class Management > Add Class (select grade level)
- **Expected outcomes**: Class created with specified grade, teacher can be assigned
- **Prerequisites**: Admin logged in

### Test Case 3.2: Assign Teacher to Class (Admin)
- **What to test**: Assigning a teacher to a class
- **How to test**: UI - Admin dashboard > Class Management > Edit class > Select teacher
- **Expected outcomes**: Teacher assigned to class, no scheduling conflicts
- **Prerequisites**: Admin logged in, teacher and class exist

### Test Case 3.3: Create Subject (Admin)
- **What to test**: Admin creating new subjects
- **How to test**: UI - Admin dashboard > Subject Management > Add Subject
- **Expected outcomes**: Subject created, available for schedule assignment
- **Prerequisites**: Admin logged in

### Test Case 3.4: Create Weekly Schedule (Admin)
- **What to test**: Admin manually creating a weekly schedule
- **How to test**: UI - Admin dashboard > Schedule Management > Create Schedule (add periods, assign subjects)
- **Expected outcomes**: Schedule created, conflict detection works
- **Prerequisites**: Admin logged in, classes, teachers, subjects exist

### Test Case 3.5: Auto Timetable Generation (Admin)
- **What to test**: Automatic timetable generation with intelligent algorithms
- **How to test**: UI - Admin dashboard > Auto Timetable Generator > Select teachers/classes > Generate
- **Expected outcomes**: Balanced weekly schedule created, 2-period breaks enforced, lunch break included
- **Prerequisites**: Admin logged in, teachers assigned to classes, subjects defined

### Test Case 3.6: View Schedule (Teacher/Student)
- **What to test**: Users viewing their schedules
- **How to test**: UI - Teacher/Student dashboard > Schedule Viewer
- **Expected outcomes**: Personal/class schedule displayed correctly with time slots
- **Prerequisites**: Schedule exists for the user/class

## 4. Calendar

### Test Case 4.1: View Calendar with Holidays
- **What to test**: Calendar display with pre-loaded Indian national holidays
- **How to test**: UI - Calendar page > Navigate through months (2024-2026)
- **Expected outcomes**: Holidays displayed and highlighted in green (e.g., Republic Day, Diwali)
- **Prerequisites**: None

### Test Case 4.2: Create Admin Event (Admin)
- **What to test**: Admin creating institutional events
- **How to test**: UI - Admin dashboard > Calendar > Add Event (date, title, description)
- **Expected outcomes**: Event created, appears on calendar highlighted in red
- **Prerequisites**: Admin logged in

### Test Case 4.3: Edit Event (Admin)
- **What to test**: Admin editing existing events
- **How to test**: UI - Calendar > Click on event > Edit details
- **Expected outcomes**: Event details updated successfully
- **Prerequisites**: Admin logged in, event exists

### Test Case 4.4: Delete Event (Admin)
- **What to test**: Admin deleting calendar events
- **How to test**: UI - Calendar > Click on event > Delete
- **Expected outcomes**: Event removed from calendar
- **Prerequisites**: Admin logged in, event exists

## 5. Messaging

### Test Case 5.1: Send Text Message (Teacher to Student)
- **What to test**: Sending text messages between teacher and student
- **How to test**: UI - Teacher dashboard > Personal Chat > Select student > Type message > Send
- **Expected outcomes**: Message sent successfully, appears in chat for both users
- **Prerequisites**: Teacher and student users exist

### Test Case 5.2: Reply to Message
- **What to test**: Replying to specific messages in conversations
- **How to test**: UI - Chat interface > Click reply on a message > Type reply > Send
- **Expected outcomes**: Reply message threaded under the original message
- **Prerequisites**: Existing conversation

### Test Case 5.3: Send Audio Message
- **What to test**: Recording and sending voice messages
- **How to test**: UI - Chat interface > Click audio record button > Record message > Send
- **Expected outcomes**: Audio message sent and playable by recipient
- **Prerequisites**: Microphone access granted, conversation exists

### Test Case 5.4: Unread Message Notification
- **What to test**: Notification system for unread messages
- **How to test**: UI - Send message to offline user > User logs in > Check navigation badges
- **Expected outcomes**: Unread message count displayed in navigation, updates when read
- **Prerequisites**: Users exist, messaging enabled

## 6. Assignments

### Test Case 6.1: Create Assignment (Teacher)
- **What to test**: Teacher creating assignments for classes
- **How to test**: UI - Teacher dashboard > Assignments > Create New > Select classes > Add details > Attach files
- **Expected outcomes**: Assignment created, automatic notifications sent to students
- **Prerequisites**: Teacher logged in, classes assigned to teacher

### Test Case 6.2: Submit Assignment (Student)
- **What to test**: Student submitting assignment work
- **How to test**: UI - Student dashboard > Assignments > Select assignment > Upload file > Submit
- **Expected outcomes**: Submission recorded, status changed to "Submitted"
- **Prerequisites**: Student logged in, assignment exists

### Test Case 6.3: Grade Assignment (Teacher)
- **What to test**: Teacher reviewing and grading submissions
- **How to test**: UI - Teacher dashboard > Assignments > Review Submissions > Add marks/feedback > Grade
- **Expected outcomes**: Submission graded, marks and feedback saved
- **Prerequisites**: Teacher logged in, student submission exists

### Test Case 6.4: Reassign Assignment (Teacher)
- **What to test**: Teacher requesting resubmission of work
- **How to test**: UI - Teacher dashboard > Assignments > Review > Reject submission > Add feedback
- **Expected outcomes**: Assignment status changed to "Reassigned", student notified
- **Prerequisites**: Teacher logged in, graded submission exists

### Test Case 6.5: View Assignment Status (Student)
- **What to test**: Student checking assignment submission status
- **How to test**: UI - Student dashboard > Assignment Dashboard
- **Expected outcomes**: Status displayed correctly (Pending, Submitted, Overdue, Graded)
- **Prerequisites**: Student logged in, assignments exist

## 7. Reports

### Test Case 7.1: View Student Performance (Student)
- **What to test**: Student viewing personal performance analytics
- **How to test**: UI - Student dashboard > Performance section
- **Expected outcomes**: Charts display average score, completion rate, grade distribution
- **Prerequisites**: Student logged in, graded assignments exist

### Test Case 7.2: View Class Performance (Teacher)
- **What to test**: Teacher viewing class-wide performance metrics
- **How to test**: UI - Teacher dashboard > Performance Analytics
- **Expected outcomes**: Class statistics, student progress charts displayed
- **Prerequisites**: Teacher logged in, students with assignments

### Test Case 7.3: Generate Reports (Admin)
- **What to test**: Admin accessing comprehensive institutional reports
- **How to test**: UI - Admin dashboard > Reports page
- **Expected outcomes**: Institution-wide analytics, activity logs, performance summaries
- **Prerequisites**: Admin logged in, sufficient data exists

## 8. Admin Setup

### Test Case 8.1: Admin Registration
- **What to test**: New institution admin registration process
- **How to test**: UI - Landing page > Admin Setup > Registration form
- **Expected outcomes**: Admin account created in master database, tenant database initialized
- **Prerequisites**: None

### Test Case 8.2: Database Cleanup on Admin Delete
- **What to test**: Automatic cleanup when admin account is deleted
- **How to test**: API/UI - Delete admin account from master database
- **Expected outcomes**: Associated tenant database removed
- **Prerequisites**: Admin account exists with tenant database

### Test Case 8.3: Activity Logging
- **What to test**: Comprehensive activity logging for all operations
- **How to test**: Manual - Perform various actions (create user, send message, etc.) > Check database logs
- **Expected outcomes**: All actions logged in appropriate database (master/tenant) with timestamps, IP, user details
- **Prerequisites**: Users logged in, actions performed