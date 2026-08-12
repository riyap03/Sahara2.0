const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    senior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
        "plumbing",
        "electricity",
        "medicine",
        "doctor",
        "hospital",
        "bank",
        "government",
        "grocery",
        "transport",
        "repair",
        "house_help",
        "other"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: [
        "low",
        "normal",
        "high",
        "critical"
      ],
      default: "normal"
    },

    status: {
      type: String,
      enum: [
        "pending",
        "searching",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
        "escalated"
      ],
      default: "pending"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    location: {
      lat: Number,
      lng: Number
    },

    preferredTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "HelpRequest",
  helpRequestSchema
);