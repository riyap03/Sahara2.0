const validate = (req, res, next) => {
  const errors = [];

  if (!req.validationResult) {
    return next();
  }

  const result = req.validationResult(req);
  if (!result.isEmpty()) {
    result.array().forEach(err => {
      errors.push({
        field: err.path || err.param,
        message: err.msg
      });
    });
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

module.exports = validate;
