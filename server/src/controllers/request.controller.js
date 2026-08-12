const HelpRequest = require('../models/HelpRequest');
const Task = require('../models/Task');
const { runBackupChain } = require('../services/backupChain.service');
const { detectIntent } = require('../services/ai.service');
const generateOtp = require('../utils/generateOtp');

const createRequest = async (req, res) => {
  try {
    let { type, description, priority, location, preferredTime } = req.body;

    const detected = detectIntent(description);

    if (!type) {
      type = detected.intent;
    }

    if (!priority) {
      priority = detected.priority;
    }

    const helpRequest = await HelpRequest.create({
      senior: req.user._id,
      type,
      description,
      priority: priority || 'normal',
      status: 'searching',
      location,
      preferredTime
    });

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('senior', 'name phone location');

    const chainResult = await runBackupChain(helpRequest._id);

    if (chainResult.task) {
      res.status(201).json({
        success: true,
        message: 'Help request created and backup assigned',
        request: chainResult.request,
        backup: {
          level: chainResult.level,
          matchType: chainResult.matchType,
          helper: chainResult.helper,
          reason: chainResult.reason
        },
        task: {
          id: chainResult.task._id,
          status: chainResult.task.status,
          otp: chainResult.otp
        }
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Help request created and escalated',
        request: chainResult.request,
        backup: chainResult,
        escalation: true
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ senior: req.user._id })
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

const getRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id)
      .populate('senior', 'name phone')
      .populate('assignedTo', 'name phone role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('senior', 'name phone')
     .populate('assignedTo', 'name phone role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request updated',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findOneAndUpdate(
      { _id: req.params.id, senior: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    await Task.findOneAndUpdate(
      { request: request._id },
      { status: 'cancelled' }
    );

    res.json({
      success: true,
      message: 'Request cancelled',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequest,
  updateRequest,
  cancelRequest
};
