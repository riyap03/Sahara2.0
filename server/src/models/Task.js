const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  seniorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'transport', 'medicine', 'household', 'accompaniment', 'essentials', 'emergency']
  },
  requiredSkill: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['created', 'searching', 'assigned', 'accepted', 'in-progress', 'completed', 'cancelled', 'escalated'],
    default: 'created'
  },
  location: {
    address: String,
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  matchingCandidates: [{
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'matchingCandidates.candidateModel'
    },
    candidateModel: {
      type: String,
      enum: ['User', 'EmergencyService'],
      default: 'User'
    },
    tier: {
      type: String,
      enum: ['trusted', 'professional', 'emergency'],
      required: true
    },
    score: Number,
    isPrimary: Boolean,
    isBackup: Boolean,
    status: {
      type: String,
      enum: ['pending', 'notified', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    },
    notifiedAt: Date,
    notificationExpiresAt: Date,
    respondedAt: Date
  }],
  assignedHelperId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assignedCandidateModel'
  },
  assignedCandidateModel: {
    type: String,
    enum: ['User', 'EmergencyService'],
    default: 'User'
  },
  otp: {
    code: String,
    expiresAt: Date,
    verified: {
      type: Boolean,
      default: false
    }
  },
  checkIn: {
    at: Date,
    location: {
      lat: Number,
      lng: Number
    }
  },
  checkOut: {
    at: Date
  },
  completionNotes: String,
  aiGenerated: {
    type: Boolean,
    default: false
  },
  familyNotified: {
    type: Boolean,
    default: false
  },
  escalationLevel: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

taskSchema.index({ seniorId: 1, status: 1 });
taskSchema.index({ status: 1, createdAt: 1 });
taskSchema.index({ assignedHelperId: 1 });

module.exports = mongoose.model('Task', taskSchema);
