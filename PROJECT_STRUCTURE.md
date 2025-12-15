# Hospital Management System Backend - Project Structure

## Complete File Structure

```
project/
├── src/
│   ├── models/
│   │   ├── Patient.js          ✅ Patient schema with validation
│   │   ├── Blog.js              ✅ Blog schema with auto-excerpt & read time
│   │   └── Admin.js             ✅ Admin schema with password hashing
│   │
│   ├── controllers/
│   │   ├── authController.js    ✅ Login, password change, admin info
│   │   ├── appointmentController.js ✅ Appointment booking & status
│   │   ├── patientController.js ✅ Patient CRUD, walk-in, today's list
│   │   ├── blogController.js    ✅ Blog CRUD, public/admin views
│   │   └── dashboardController.js ✅ Dashboard stats & trends
│   │
│   ├── routes/
│   │   ├── publicRoutes.js      ✅ Public APIs (no auth)
│   │   └── adminRoutes.js       ✅ Admin APIs (JWT protected)
│   │
│   ├── middleware/
│   │   ├── auth.js              ✅ JWT verification & role check
│   │   ├── error.js             ✅ Global error handling
│   │   └── validation.js        ✅ Input validation for all endpoints
│   │
│   └── app.js                   ✅ Express app setup with CORS
│
├── server.js                    ✅ Server entry point & DB connection
├── package.json                 ✅ Dependencies configured
├── .env                         ✅ Environment variables
├── .gitignore                   ✅ Git ignore rules
└── README.md                    ✅ Full API documentation

```

## What Each File Does

### Models (3 files)

**Patient.js**
- Stores patient/appointment information
- Validates phone numbers (10 digits, Indian format)
- Validates email format
- Ensures appointment dates are not in past
- Automatically updates timestamps

**Blog.js**
- Stores blog articles with multi-language support
- Auto-generates excerpt if not provided
- Auto-calculates read time
- Tracks view count
- Supports filtering by category

**Admin.js**
- Stores admin credentials
- Hashes passwords with bcrypt (10 salt rounds)
- Tracks last login
- Supports role-based access (admin/receptionist)

### Controllers (5 files)

**authController.js**
- `login` - Admin login with JWT token generation
- `getCurrentAdmin` - Get logged-in admin info
- `changePassword` - Change admin password

**appointmentController.js**
- `bookAppointment` - Public appointment booking with validation
- `getAppointmentStatus` - Check status by phone number

**patientController.js**
- `getAllPatients` - List all patients with search & filters
- `getPatientById` - Get single patient details
- `updatePatient` - Update patient information
- `createWalkInPatient` - Register walk-in patients
- `getTodayPatients` - Get today's appointments
- `updateAppointmentStatus` - Change appointment status
- `getAppointmentsByDate` - Get appointments for specific date

**blogController.js**
- `getPublicBlogs` - Get published blogs (with pagination)
- `getPublicBlogById` - Get single blog (increments views)
- `getAllBlogsAdmin` - Admin: all blogs (published/draft)
- `getBlogByIdAdmin` - Admin: get blog for editing
- `createBlog` - Create new blog
- `updateBlog` - Update existing blog
- `deleteBlog` - Delete blog
- `getCategories` - Get all blog categories

**dashboardController.js**
- `getDashboardStats` - Full dashboard with trends
- `getQuickStats` - Quick overview stats

### Routes (2 files)

**publicRoutes.js**
- POST /api/appointments - Book appointment (rate limited: 5/hour)
- GET /api/appointments/status - Check status
- GET /api/blogs - Get published blogs
- GET /api/blogs/:id - Get single blog
- GET /api/blogs/categories - Get categories

**adminRoutes.js**
- POST /api/admin/login - Admin login
- GET /api/admin/me - Get admin info
- PUT /api/admin/change-password - Change password
- GET /api/admin/dashboard/stats - Full dashboard
- GET /api/admin/dashboard/quick-stats - Quick stats
- GET /api/admin/patients - List patients
- GET /api/admin/patients/:id - Get patient
- PUT /api/admin/patients/:id - Update patient
- POST /api/admin/patients/walkin - Register walk-in
- GET /api/admin/appointments - Get appointments by date
- GET /api/admin/appointments/today - Today's appointments
- PUT /api/admin/appointments/:id/status - Update status
- GET /api/admin/blogs - List blogs
- POST /api/admin/blogs - Create blog
- PUT /api/admin/blogs/:id - Update blog
- DELETE /api/admin/blogs/:id - Delete blog (admin only)

### Middleware (3 files)

**auth.js**
- `authMiddleware` - Validates JWT tokens
- `roleCheck` - Checks user role (admin/receptionist)

**error.js**
- `errorHandler` - Global error handling with proper status codes
- `notFound` - Handle 404 routes

**validation.js**
- `validateAppointment` - Validate appointment booking data
- `validateLogin` - Validate admin login
- `validateBlog` - Validate blog creation/update

### Main Files

**app.js**
- Express app configuration
- CORS setup for multiple origins
- Middleware registration
- Route mounting
- Error handling setup

**server.js**
- MongoDB connection with retry logic
- Create default admin on first run
- Graceful shutdown handling
- Server startup on port 5000

## API Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## Key Features

✅ JWT authentication with 7-day expiration
✅ Bcrypt password hashing (10 salt rounds)
✅ Input validation on all endpoints
✅ Rate limiting (5 appointments/hour per IP)
✅ CORS enabled for multiple origins
✅ MongoDB Atlas integration
✅ Automatic admin creation on first run
✅ Error handling middleware
✅ Database connection retry logic
✅ Graceful shutdown
✅ Health check endpoint

## Default Credentials

Username: `admin`
Password: `admin123`

⚠️ Change these in production!

## Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
NODE_ENV=development
```

## Starting the Server

```bash
npm start
```

Server runs on: http://localhost:5000

## Validation Rules

- Phone: Required, 10 digits, starts with 6-9
- Email: Optional, must be valid format
- Name: Required, min 3 characters
- Appointment Date: Required, not in past
- Blog Title: Required, min 10 characters
- Blog Content: Required, min 100 characters

---

All files are properly created and ready to use!
