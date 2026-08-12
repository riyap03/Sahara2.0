const User = require('../models/User');

const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'language',
      'address',
      'city',
      'location',
      'profilePhoto'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
