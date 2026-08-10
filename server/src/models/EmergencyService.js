const mongoose = require('mongoose');

const emergencyServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ngo', 'college-volunteer', 'government', 'private']
  },
  organization: {
    type: String,
    required: true
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  services: [{
    type: String,
    enum: [
      'medical',
      'transport',
      'medicine',
      'household',
      'accompaniment',
      'essentials',
      'emergency',
      'plumber',
      'electrician',
      'driver',
      'caretaker',
      'nurse',
      'cleaner',
      'security',
      'all'
    ]
  }],
  coverageArea: {
    type: String,
    required: true
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
    default: 25
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
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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
  responseTime: {
    type: String,
    default: '30 minutes'
  },
  description: String
}, {
  timestamps: true
});

emergencyServiceSchema.index({ services: 1, 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 });
emergencyServiceSchema.index({ isActive: 1, availability: 1 });

module.exports = mongoose.model('EmergencyService', emergencyServiceSchema);
