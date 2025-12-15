const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit Indian phone number'
    }
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Please enter a valid age']
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  address: {
    type: String,
    trim: true
  },
  disease: {
    type: String,
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  medicalHistory: {
    type: String,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  appointmentTime: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: 'Status must be pending, confirmed, completed, or cancelled'
    },
    default: 'pending'
  },
  isWalkIn: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

patientSchema.index({ phone: 1 });
patientSchema.index({ appointmentDate: 1, status: 1 });

module.exports = mongoose.model('Patient', patientSchema);
