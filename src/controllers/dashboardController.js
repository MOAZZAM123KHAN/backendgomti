const Patient = require('../models/Patient');
const Blog = require('../models/Blog');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      todayPatients,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalBlogs,
      publishedBlogs
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({
        appointmentDate: {
          $gte: today,
          $lt: tomorrow
        }
      }),
      Patient.countDocuments({ status: 'pending' }),
      Patient.countDocuments({ status: 'confirmed' }),
      Patient.countDocuments({ status: 'completed' }),
      Patient.countDocuments({ status: 'cancelled' }),
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true })
    ]);

    const recentAppointments = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name phone appointmentDate appointmentTime status');

    const upcomingAppointments = await Patient.find({
      appointmentDate: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
      .sort({ appointmentDate: 1 })
      .limit(10)
      .select('name phone appointmentDate appointmentTime status');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalPatients,
          todayPatients,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
          cancelledAppointments,
          totalBlogs,
          publishedBlogs
        },
        recentAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuickStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      todayPatients,
      pendingAppointments,
      confirmedAppointments
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({
        appointmentDate: {
          $gte: today,
          $lt: tomorrow
        }
      }),
      Patient.countDocuments({ status: 'pending' }),
      Patient.countDocuments({ status: 'confirmed' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        todayPatients,
        pendingAppointments,
        confirmedAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};
