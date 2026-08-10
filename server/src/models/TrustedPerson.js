const mongoose = require('mongoose');

const trustedPersonSchema = new mongoose.Schema({
  seniorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  skills: [String],
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  approved: {
    type: Boolean,
    default: true
  },
  relationship: {
    type: String
  },
  notes: String
}, {
  timestamps: true
});

trustedPersonSchema.index({ seniorId: 1, service: 1 });

module.exports = mongoose.model('TrustedPerson', trustedPersonSchema);
