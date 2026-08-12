const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getSeniorInfo,
  getSeniorRequests,
  getSeniorTasks,
  getSeniorNotifications,
  connectToSenior
} = require('../controllers/family.controller');

const router = express.Router();

router.get('/senior/:seniorId', protect, getSeniorInfo);
router.get('/senior/:seniorId/requests', protect, getSeniorRequests);
router.get('/senior/:seniorId/tasks', protect, getSeniorTasks);
router.get('/senior/:seniorId/notifications', protect, getSeniorNotifications);
router.post('/senior/:seniorId/connect', protect, connectToSenior);

module.exports = router;
