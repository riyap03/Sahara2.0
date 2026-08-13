const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { findBestMatch } = require('../services/matching.service');

const router = express.Router();

router.post('/find', protect, async (req, res) => {
  try {
    const result = await findBestMatch(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
