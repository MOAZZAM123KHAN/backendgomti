const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const appointmentController = require('../controllers/appointmentController');
const blogController = require('../controllers/blogController');
const { validateAppointment } = require('../middleware/validation');

const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many appointment requests from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/appointments', appointmentLimiter, validateAppointment, appointmentController.bookAppointment);

router.get('/appointments/status', appointmentController.getAppointmentStatus);

router.get('/blogs', blogController.getPublicBlogs);

router.get('/blogs/categories', blogController.getCategories);

router.get('/blogs/:id', blogController.getPublicBlogById);

module.exports = router;
