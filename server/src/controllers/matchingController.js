const matchingEngine = require('../services/matchingEngine');
const Task = require('../models/Task');

exports.findMatches = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await matchingEngine.findMatches(taskId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.handleRejection = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { helperId } = req.body;

    const result = await matchingEngine.handleRejection(taskId, helperId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.handleAcceptance = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { helperId } = req.body;

    const result = await matchingEngine.handleAcceptance(taskId, helperId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTaskMatches = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await matchingEngine.getTaskMatches(taskId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.triggerMatchForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await matchingEngine.findMatches(taskId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
