const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

router.get('/task/:taskId', matchingController.getTaskMatches);
router.post('/task/:taskId/find', matchingController.findMatches);
router.post('/task/:taskId/accept', matchingController.handleAcceptance);
router.post('/task/:taskId/reject', matchingController.handleRejection);

module.exports = router;
