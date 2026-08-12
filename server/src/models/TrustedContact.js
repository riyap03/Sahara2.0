const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema({
  senior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relation: {
    type: String,
    enum: [
      'family',
      'neighbour',
      'doctor',
      'society_guard',
      'friend',
      'volunteer',
      'other'
    ],
    default: 'other'
  },
  priority: {
    type: Number,
    default: 1
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrustedContact', trustedContactSchema);
