const HelpRequest = require('../models/HelpRequest');
const { triggerEmergency } = require('../services/escalation.service');
const { createNotification } = require('../services/notification.service');

const emergency = async (req, res) => {
  try {
    const { description, location } = req.body;

    const result = await triggerEmergency(req.user._id, description, location);

    res.status(201).json({
      success: true,
      message: 'Emergency request triggered',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  emergency
};
