const { body } = require('express-validator');

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['senior', 'family', 'provider', 'volunteer', 'admin']).withMessage('Invalid role')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateRequest = [
  body('type').isIn(['plumbing', 'electricity', 'medicine', 'doctor', 'hospital', 'bank', 'government', 'grocery', 'transport', 'repair', 'house_help', 'other']).withMessage('Invalid request type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'critical']).withMessage('Invalid priority'),
  body('location').optional().isObject().withMessage('Location must be an object')
];

const validateProvider = [
  body('serviceType').isIn(['plumber', 'electrician', 'carpenter', 'house_help', 'mobile_repair', 'ac_repair', 'driver', 'chemist', 'caregiver', 'technician', 'other']).withMessage('Invalid service type'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('location').optional().isObject().withMessage('Location must be an object')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRequest,
  validateProvider
};
