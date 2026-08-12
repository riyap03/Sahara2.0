const { findBestMatch } = require('./matching.service');
const HelpRequest = require('../models/HelpRequest');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const generateOtp = require('../utils/generateOtp');

const runBackupChain = async (requestId) => {
  const helpRequest = await HelpRequest.findById(requestId)
    .populate('senior', 'name location')
    .populate('assignedTo', 'name');

  if (!helpRequest) {
    throw new Error('Help request not found');
  }

  const result = await findBestMatch({
    type: helpRequest.type,
    senior: helpRequest.senior,
    location: helpRequest.location || helpRequest.senior.location
  });

  if (result.level === 4) {
    helpRequest.status = 'escalated';
    await helpRequest.save();

    await createNotification(helpRequest.senior, 'BACKUP_ESCALATED', 'Backup Escalation', 'No suitable helper found. Request escalated.');

    if (helpRequest.priority === 'critical') {
      await escalateEmergency(helpRequest);
    }

    return {
      level: 4,
      request: helpRequest,
      escalation: true
    };
  }

  helpRequest.assignedTo = result.helper._id;
  helpRequest.status = 'assigned';
  await helpRequest.save();

  const otp = generateOtp();

  const task = await Task.create({
    request: helpRequest._id,
    senior: helpRequest.senior._id,
    helper: result.helper._id,
    otp,
    status: 'assigned'
  });

  await createNotification(result.helper, 'HELPER_ASSIGNED', 'New Task Assigned', `You have been assigned a new ${helpRequest.type} task.`);
  await createNotification(helpRequest.senior, 'HELPER_ASSIGNED', 'Helper Assigned', `${result.helper.name} has been assigned to your request. OTP: ${otp}`);

  return {
    level: result.level,
    matchType: result.matchType,
    helper: result.helper,
    reason: result.reason,
    request: helpRequest,
    task,
    otp
  };
};

const escalateEmergency = async (helpRequest) => {
  const familyContacts = await User.find({
    role: 'family',
    _id: { $ne: helpRequest.senior }
  });

  for (const family of familyContacts) {
    await createNotification(family._id, 'EMERGENCY', 'Emergency Alert', `Emergency escalation for senior request.`);
  }

  await createNotification(helpRequest.senior, 'EMERGENCY', 'Emergency Services', 'Emergency services have been notified.');
};

const createNotification = async (recipientId, type, title, message, relatedRequest, relatedTask) => {
  await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    relatedRequest,
    relatedTask
  });
};

module.exports = {
  runBackupChain,
  escalateEmergency,
  createNotification
};
