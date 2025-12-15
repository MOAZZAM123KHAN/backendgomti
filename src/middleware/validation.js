// const validateAppointment = (req, res, next) => {
//   const { name, phone, appointmentDate } = req.body;
//   const errors = [];

//   if (!name || name.trim().length < 3) {
//     errors.push('Name is required and must be at least 3 characters long');
//   }

//   if (!phone) {
//     errors.push('Phone number is required');
//   } else if (!/^[6-9]\d{9}$/.test(phone)) {
//     errors.push('Please provide a valid 10-digit Indian phone number');
//   }

//   if (!appointmentDate) {
//     errors.push('Appointment date is required');
//   } else {
//     const appointmentDay = new Date(appointmentDate);
//     appointmentDay.setHours(0, 0, 0, 0);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (appointmentDay < today) {
//       errors.push('Appointment date cannot be in the past');
//     }
//   }

//   if (req.body.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
//     errors.push('Please provide a valid email address');
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors
//     });
//   }

//   next();
// };

// const validateLogin = (req, res, next) => {
//   const { username, password } = req.body;
//   const errors = [];

//   if (!username || username.trim().length < 3) {
//     errors.push('Username is required and must be at least 3 characters long');
//   }

//   if (!password || password.length < 6) {
//     errors.push('Password is required and must be at least 6 characters long');
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors
//     });
//   }

//   next();
// };

// const validateBlog = (req, res, next) => {
//   const { title, content } = req.body;
//   const errors = [];

//   if (!title || title.trim().length < 10) {
//     errors.push('Title is required and must be at least 10 characters long');
//   }

//   if (!content || content.trim().length < 100) {
//     errors.push('Content is required and must be at least 100 characters long');
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors
//     });
//   }

//   next();
// };

// module.exports = {
//   validateAppointment,
//   validateLogin,
//   validateBlog
// };

/**
 * ===============================
 * APPOINTMENT VALIDATION
 * ===============================
 */
const validateAppointment = (req, res, next) => {
  const { name, phone, appointmentDate } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Name is required and must be at least 3 characters long');
  }

  if (!phone) {
    errors.push('Phone number is required');
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.push('Please provide a valid 10-digit Indian phone number');
  }

  if (!appointmentDate) {
    errors.push('Appointment date is required');
  } else {
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDay < today) {
      errors.push('Appointment date cannot be in the past');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * ===============================
 * LOGIN VALIDATION
 * ===============================
 */
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username is required and must be at least 3 characters long');
  }

  if (!password || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * ===============================
 * BLOG VALIDATION (NEW LOGIC)
 * ===============================
 */
const validateBlog = (req, res, next) => {
  const { titleHindi, titleEnglish, content } = req.body;
  const errors = [];

  if (!titleHindi && !titleEnglish) {
    errors.push('Either Hindi title or English title is required');
  }

  if (titleHindi && titleHindi.trim().length < 10) {
    errors.push('Hindi title must be at least 10 characters long');
  }

  if (titleEnglish && titleEnglish.trim().length < 5) {
    errors.push('English title must be at least 5 characters long');
  }

  if (!content || content.trim().length < 100) {
    errors.push('Content must be at least 100 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateAppointment,
  validateLogin,
  validateBlog
};
