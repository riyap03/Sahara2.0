const mongoose = require('mongoose');

const helperProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  serviceType: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: {
    type: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available'
    },
    workingHours: {
      start: String,
      end: String
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  location: {
    address: String,
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  serviceRadius: {
    type: Number,
    default: 10
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  cancelledTasks: {
    type: Number,
    default: 0
  },
  responseRate: {
    type: Number,
    default: 100
  },
  avgResponseTime: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HelperProfile', helperProfileSchema);
