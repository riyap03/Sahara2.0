const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  addContact,
  getContacts,
  updateContact,
  deleteContact
} = require('../controllers/trustedCircle.controller');

const router = express.Router();

router.post('/', protect, addContact);
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
