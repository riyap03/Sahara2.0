const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { createNotification } = require('./notification.service');

const escalateRequest = async (requestId) => {
  const helpRequest = await HelpRequest.findById(requestId).populate('senior', 'name');

  if (!helpRequest) {
    throw new Error('Help request not found');
  }

  helpRequest.status = 'escalated';
  await helpRequest.save();

  const familyMembers = await User.find({
    role: 'family'
  });

  for (const member of familyMembers) {
    await createNotification(
      member._id,
      'BACKUP_ESCALATED',
      'Request Escalated',
      `Help request for ${helpRequest.senior.name} has been escalated.`
    );
  }

  await createNotification(
    helpRequest.senior._id,
    'BACKUP_ESCALATED',
    'Request Escalated',
    'Your request has been escalated. We are finding the best available help.'
  );

  return {
    success: true,
    message: 'Request escalated successfully',
    request: helpRequest
  };
};

const triggerEmergency = async (seniorId, description, location) => {
  const senior = await User.findById(seniorId);

  if (!senior) {
    throw new Error('Senior not found');
  }

  const helpRequest = await HelpRequest.create({
    senior: seniorId,
    type: 'hospital',
    description: description || 'Emergency assistance required',
    priority: 'critical',
    status: 'escalated',
    location
  });

  const familyMembers = await User.find({
    role: 'family'
  });

  for (const member of familyMembers) {
    await createNotification(
      member._id,
      'EMERGENCY',
      'Emergency Alert',
      `Emergency triggered by ${senior.name}. Immediate attention required.`
    );
  }

  await createNotification(
    seniorId,
    'EMERGENCY',
    'Emergency Services Contacted',
    'Emergency services have been notified. Family has been alerted.'
  );

  return {
    success: true,
    message: 'Emergency triggered',
    request: helpRequest,
    emergencyNumbers: {
      general: '112',
      elderLine: '14567',
      ambulance: '108'
    }
  };
};

module.exports = {
  escalateRequest,
  triggerEmergency
};
