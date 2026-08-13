const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  generateFamilyCode,
  connectViaCode,
  getMySeniors,
  inviteFamilyMember
} = require('../controllers/familyCode.controller');

const router = express.Router();

router.post('/generate-code', protect, generateFamilyCode);
router.post('/connect', protect, connectViaCode);
router.get('/my-seniors', protect, getMySeniors);
router.post('/invite', protect, inviteFamilyMember);

module.exports = router;
