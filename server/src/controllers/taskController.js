const Task = require('../models/Task');
const matchingEngine = require('../services/matchingEngine');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    const result = await matchingEngine.findMatches(task._id);

    res.status(201).json({
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

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('seniorId', 'name phone')
      .populate('assignedHelperId', 'name phone');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('seniorId', 'name')
      .populate('assignedHelperId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
