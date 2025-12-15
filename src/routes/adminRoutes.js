const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const patientController = require('../controllers/patientController');
const blogController = require('../controllers/blogController');
const dashboardController = require('../controllers/dashboardController');

const { authMiddleware, roleCheck } = require('../middleware/auth');
const { validateLogin, validateAppointment, validateBlog } = require('../middleware/validation');

router.post('/login', validateLogin, authController.login);

router.use(authMiddleware);

router.get('/me', authController.getCurrentAdmin);
router.put('/change-password', authController.changePassword);

router.get('/dashboard/stats', dashboardController.getDashboardStats);
router.get('/dashboard/quick-stats', dashboardController.getQuickStats);

router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id', patientController.updatePatient);
router.post('/patients/walkin', validateAppointment, patientController.createWalkInPatient);

router.get('/appointments', patientController.getAppointmentsByDate);
router.get('/appointments/today', patientController.getTodayPatients);
router.put('/appointments/:id/status', patientController.updateAppointmentStatus);

router.get('/blogs', blogController.getAllBlogsAdmin);
router.get('/blogs/:id', blogController.getBlogByIdAdmin);
// router.post('/blogs', validateBlog, blogController.createBlog);
// router.put('/blogs/:id', validateBlog, blogController.updateBlog);
router.post('/blogs', validateBlog, blogController.createBlog);
router.put('/blogs/:id', validateBlog, blogController.updateBlog);

router.delete('/blogs/:id', roleCheck('admin'), blogController.deleteBlog);

module.exports = router;
