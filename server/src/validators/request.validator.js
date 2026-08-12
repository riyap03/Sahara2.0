const { body } = require('express-validator');

const validateRequest = [
  body('type').isIn(['plumbing', 'electricity', 'medicine', 'doctor', 'hospital', 'bank', 'government', 'grocery', 'transport', 'repair', 'house_help', 'other']).withMessage('Invalid request type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'critical']).withMessage('Invalid priority'),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('preferredTime').optional().isISO8601().withMessage('Invalid preferred time format')
];

module.exports = {
  validateRequest
};
