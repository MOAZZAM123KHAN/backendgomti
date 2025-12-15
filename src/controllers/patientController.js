const Patient = require('../models/Patient');

exports.getAllPatients = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      page = 1,
      limit = 20,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) {
        query.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.appointmentDate.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort({ appointmentDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Patient.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'email', 'age', 'gender', 'address',
      'disease', 'symptoms', 'medicalHistory', 'appointmentDate',
      'appointmentTime', 'status'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.createWalkInPatient = async (req, res, next) => {
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
      appointmentTime
    } = req.body;

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
      appointmentDate: new Date(),
      appointmentTime,
      status: 'confirmed',
      isWalkIn: true
    });

    res.status(201).json({
      success: true,
      message: 'Walk-in patient registered successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodayPatients = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const patients = await Patient.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ appointmentTime: 1 });

    res.status(200).json({
      success: true,
      data: patients,
      count: patients.length
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, completed, or cancelled'
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date, status } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const query = {
      appointmentDate: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (status) {
      query.status = status;
    }

    const appointments = await Patient.find(query)
      .sort({ appointmentTime: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    next(error);
  }
};
