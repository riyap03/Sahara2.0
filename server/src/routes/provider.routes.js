const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  createProvider,
  getProviders,
  getProvider,
  updateProvider,
  updateAvailability
} = require('../controllers/provider.controller');

const router = express.Router();

router.post('/', protect, createProvider);
router.get('/', protect, getProviders);
router.get('/:id', protect, getProvider);
router.put('/:id', protect, updateProvider);
router.patch('/availability', protect, updateAvailability);

module.exports = router;
