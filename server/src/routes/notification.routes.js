const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getMyNotifications,
  readNotification
} = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, readNotification);

module.exports = router;
