const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getMyTasks,
  acceptTask,
  rejectTask,
  verifyOtp,
  checkIn,
  checkOut,
  completeTask
} = require('../controllers/task.controller');

const router = express.Router();

router.get('/my', protect, getMyTasks);
router.post('/:id/accept', protect, acceptTask);
router.post('/:id/reject', protect, rejectTask);
router.post('/:id/verify-otp', protect, verifyOtp);
router.post('/:id/check-in', protect, checkIn);
router.post('/:id/check-out', protect, checkOut);
router.post('/:id/complete', protect, completeTask);

module.exports = router;
