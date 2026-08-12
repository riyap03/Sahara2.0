const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  serviceType: {
    type: String,
    enum: [
      'plumber',
      'electrician',
      'carpenter',
      'house_help',
      'mobile_repair',
      'ac_repair',
      'driver',
      'chemist',
      'caregiver',
      'technician',
      'other'
    ],
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationMethod: {
    type: String,
    default: ''
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  serviceArea: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
