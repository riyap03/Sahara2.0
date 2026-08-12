const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

const getSeniorInfo = async (req, res) => {
  try {
    const senior = await User.findById(req.params.seniorId).select('-password');

    if (!senior) {
      return res.status(404).json({
        success: false,
        message: 'Senior not found'
      });
    }

    res.json({
      success: true,
      senior
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSeniorRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ senior: req.params.seniorId })
      .populate('assignedTo', 'name phone role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSeniorTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ senior: req.params.seniorId })
      .populate('helper', 'name phone role')
      .populate('request')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSeniorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.seniorId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const connectToSenior = async (req, res) => {
  try {
    const senior = await User.findById(req.params.seniorId);

    if (!senior) {
      return res.status(404).json({
        success: false,
        message: 'Senior not found'
      });
    }

    const TrustedContact = require('../models/TrustedContact');
    const existing = await TrustedContact.findOne({
      senior: req.params.seniorId,
      contact: req.user._id
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Already connected',
        connection: existing
      });
    }

    const connection = await TrustedContact.create({
      senior: req.params.seniorId,
      contact: req.user._id,
      relation: 'family',
      priority: 1,
      isApproved: true,
      emergencyAvailable: true
    });

    res.status(201).json({
      success: true,
      message: 'Connected to senior',
      connection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSeniorInfo,
  getSeniorRequests,
  getSeniorTasks,
  getSeniorNotifications,
  connectToSenior
};
