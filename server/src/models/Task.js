const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HelpRequest',
    required: true
  },
  senior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    required: true,
    select: false
  },
  otpVerified: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'assigned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
