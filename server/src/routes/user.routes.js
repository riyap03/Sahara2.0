const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
