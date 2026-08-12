const Task = require('../models/Task');
const HelpRequest = require('../models/HelpRequest');
const generateOtp = require('../utils/generateOtp');

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { senior: req.user._id },
        { helper: req.user._id }
      ]
    })
      .populate('senior', 'name phone address city')
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

const acceptTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.helper.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned helper can accept this task'
      });
    }

    task.status = 'accepted';
    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'accepted' });

    res.json({
      success: true,
      message: 'Task accepted',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const rejectTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.helper.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned helper can reject this task'
      });
    }

    task.status = 'cancelled';
    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'searching', assignedTo: null });

    res.json({
      success: true,
      message: 'Task rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const task = await Task.findById(req.params.id).select('+otp');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.senior.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only senior can verify OTP'
      });
    }

    if (task.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    task.otpVerified = true;
    task.checkInTime = new Date();
    task.status = 'in_progress';

    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'in_progress' });

    res.json({
      success: true,
      message: 'Helper checked in successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const checkIn = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.checkInTime = new Date();
    task.status = 'in_progress';
    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'in_progress' });

    res.json({
      success: true,
      message: 'Checked in successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.checkOutTime = new Date();
    task.status = 'completed';
    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'completed' });

    res.json({
      success: true,
      message: 'Task completed',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.checkOutTime = new Date();
    task.status = 'completed';
    await task.save();

    await HelpRequest.findByIdAndUpdate(task.request, { status: 'completed' });

    res.json({
      success: true,
      message: 'Task completed',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMyTasks,
  acceptTask,
  rejectTask,
  verifyOtp,
  checkIn,
  checkOut,
  completeTask
};
