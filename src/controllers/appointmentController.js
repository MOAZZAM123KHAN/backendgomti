// const Patient = require('../models/Patient');

// exports.bookAppointment = async (req, res, next) => {
//   try {
//     const {
//       name,
//       phone,
//       email,
//       age,
//       gender,
//       address,
//       disease,
//       symptoms,
//       medicalHistory,
//       appointmentDate,
//       appointmentTime
//     } = req.body;

//     const existingPatient = await Patient.findOne({
//       phone,
//       appointmentDate: {
//         $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
//         $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
//       },
//       status: { $in: ['pending', 'confirmed'] }
//     });

//     if (existingPatient) {
//       return res.status(409).json({
//         success: false,
//         message: 'You already have an appointment booked for this date'
//       });
//     }

//     const patient = await Patient.create({
//       name,
//       phone,
//       email,
//       age,
//       gender,
//       address,
//       disease,
//       symptoms,
//       medicalHistory,
//       appointmentDate,
//       appointmentTime,
//       isWalkIn: false
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Appointment booked successfully',
//       data: patient
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getAppointmentStatus = async (req, res, next) => {
//   try {
//     const { phone } = req.query;

//     if (!phone) {
//       return res.status(400).json({
//         success: false,
//         message: 'Phone number is required'
//       });
//     }

//     const appointments = await Patient.find({ phone })
//       .sort({ appointmentDate: -1 })
//       .limit(5);

//     res.status(200).json({
//       success: true,
//       data: appointments
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const Patient = require('../models/Patient');

exports.bookAppointment = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      age,
      gender,
      address,
      disease,
      symptoms,
      medicalHistory,
      appointmentDate,
      appointmentTime
    } = req.body;

    if (!name || !phone || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and appointment date are required'
      });
    }

    const dateObj = new Date(appointmentDate);
    const day = dateObj.getDay(); // 0 = Sunday

    // Block Sunday bookings
    if (day === 0) {
      return res.status(400).json({
        success: false,
        message: 'Appointments cannot be booked on Sunday'
      });
    }

    // Validate appointment time if provided
    if (appointmentTime) {
      const [hour, minute] = appointmentTime.split(':').map(Number);
      const totalMinutes = hour * 60 + minute;
      const startMinutes = 11 * 60; // 11:00 AM
      const endMinutes = 14 * 60 + 30; // 2:30 PM
      if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
        return res.status(400).json({
          success: false,
          message: 'Appointment time must be between 11:00 AM and 2:30 PM'
        });
      }
    }

    // Check if patient already has an appointment on the same date
    const existingPatient = await Patient.findOne({
      phone,
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'You already have an appointment booked for this date'
      });
    }

    const patient = await Patient.create({
      name,
      phone,
      email,
      age,
      gender,
      address,
      disease,
      symptoms,
      medicalHistory,
      appointmentDate,
      appointmentTime,
      isWalkIn: false
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: patient
    });

  } catch (error) {
    next(error);
  }
};

exports.getAppointmentStatus = async (req, res, next) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const appointments = await Patient.find({ phone })
      .sort({ appointmentDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

