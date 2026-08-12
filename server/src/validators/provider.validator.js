const { body } = require('express-validator');

const validateProvider = [
  body('serviceType').isIn(['plumber', 'electrician', 'carpenter', 'house_help', 'mobile_repair', 'ac_repair', 'driver', 'chemist', 'caregiver', 'technician', 'other']).withMessage('Invalid service type'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('location').optional().isObject().withMessage('Location must be an object')
];

module.exports = {
  validateProvider
};
