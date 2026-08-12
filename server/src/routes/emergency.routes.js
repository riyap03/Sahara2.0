const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { emergency } = require('../controllers/emergency.controller');

const router = express.Router();

router.post('/', protect, emergency);

module.exports = router;
