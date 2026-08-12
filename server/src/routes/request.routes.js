const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  createRequest,
  getMyRequests,
  getRequest,
  updateRequest,
  cancelRequest
} = require('../controllers/request.controller');

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/:id', protect, getRequest);
router.patch('/:id', protect, updateRequest);
router.patch('/:id/cancel', protect, cancelRequest);

module.exports = router;
