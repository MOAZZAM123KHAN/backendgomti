// const express = require('express');
// const cors = require('cors');

// const publicRoutes = require('./routes/publicRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const { errorHandler, notFound } = require('./middleware/error');

// const app = express();

// const corsOrigins = process.env.CORS_ORIGIN
//   ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
//   : ['http://localhost:8080', 'http://localhost:8081'];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || corsOrigins.includes(origin) || corsOrigins.includes('*')) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Hospital Management System API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// app.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Welcome to Hospital Management System API',
//     version: '1.0.0',
//     endpoints: {
//       public: {
//         appointments: 'POST /api/appointments',
//         appointmentStatus: 'GET /api/appointments/status?phone=9876543210',
//         blogs: 'GET /api/blogs',
//         blogById: 'GET /api/blogs/:id'
//       },
//       admin: {
//         login: 'POST /api/admin/login',
//         dashboard: 'GET /api/admin/dashboard/stats',
//         patients: 'GET /api/admin/patients',
//         appointments: 'GET /api/admin/appointments',
//         blogs: 'GET /api/admin/blogs'
//       }
//     }
//   });
// });

// app.use('/api', publicRoutes);
// app.use('/api/admin', adminRoutes);

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;
const connectDB = require('./config/db');
connectDB();

const express = require('express');
const cors = require('cors');

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();

/* =========================
   CORS CONFIG
========================= */
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Vercel / Postman
    if (corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Hospital Management System API'
  });
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

/* =========================
   EXPORT (VERY IMPORTANT)
========================= */
module.exports = app;

