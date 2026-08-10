const Task = require('../models/Task');
const HelperProfile = require('../models/HelperProfile');
const { sendNotificationToHelper } = require('../utils/notifications');

async function activateBackupChain(task, nextBackupCandidate) {
  task.matchingCandidates.forEach(c => {
    if (c.isPrimary && c.status === 'notified') {
      c.isPrimary = false;
      c.isBackup = true;
    }

    if (c.helperId.toString() === nextBackupCandidate.helperId.toString()) {
      c.isPrimary = true;
      c.isBackup = false;
      c.status = 'notified';
      c.notifiedAt = new Date();
      c.notificationExpiresAt = nextBackupCandidate.notificationExpiresAt || null;
    }
  });

  task.assignedHelperId = nextBackupCandidate.helperId;
  task.assignedCandidateModel = nextBackupCandidate.candidateModel || 'User';
  task.status = 'searching';

  await task.save();

  if (sendNotificationToHelper) {
    await sendNotificationToHelper(nextBackupCandidate.helperId, task);
  }

  return nextBackupCandidate;
}

function getNextBackupCandidate(matchingCandidates, rejectedHelperId) {
  const pendingBackups = matchingCandidates.filter(
    c => c.isBackup && c.status === 'pending' && c.helperId.toString() !== rejectedHelperId.toString()
  );

  pendingBackups.sort((a, b) => {
    if (a.tier !== b.tier) {
      const tierOrder = { trusted: 0, professional: 1, emergency: 2 };
      return (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99);
    }
    return b.score - a.score;
  });

  if (pendingBackups.length > 0) {
    return pendingBackups[0];
  }

  return null;
}

async function getProfessionalCandidates(task, excludedUserIds = []) {
  return HelperProfile.find({
    userId: { $nin: excludedUserIds },
    isActive: true,
    isVerified: true,
    'availability.status': { $ne: 'offline' },
    skills: { $in: [task.requiredSkill, task.category] }
  }).populate('userId', 'name phone address');
}

async function handleEmergency(task, emergencyCandidate) {
  task.matchingCandidates.forEach(c => {
    if (c.isPrimary && c.status === 'notified') {
      c.status = 'expired';
      c.isPrimary = false;
      c.isBackup = true;
    }
  });

  emergencyCandidate.isPrimary = true;
  emergencyCandidate.isBackup = false;
  emergencyCandidate.status = 'notified';
  emergencyCandidate.notifiedAt = new Date();

  task.matchingCandidates.push(emergencyCandidate);
  task.assignedHelperId = emergencyCandidate.helperId;
  task.assignedCandidateModel = emergencyCandidate.candidateModel || 'EmergencyService';
  task.status = 'searching';
  task.escalationLevel = (task.escalationLevel || 0) + 1;

  await task.save();
  await sendNotificationToHelper(emergencyCandidate.helperId, task);

  return emergencyCandidate;
}

async function escalateTask(taskId) {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  task.status = 'escalated';
  task.escalationLevel = (task.escalationLevel || 0) + 1;
  task.familyNotified = true;

  await task.save();

  return {
    taskId: task._id,
    status: task.status,
    escalationLevel: task.escalationLevel,
    message: 'Task escalated. Family has been notified.'
  };
}

async function assignFromTrustedNetwork(taskId, trustedPersonId) {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  const candidate = task.matchingCandidates.find(
    c => c.helperId.toString() === trustedPersonId.toString()
  );

  if (candidate) {
    candidate.status = 'accepted';
    candidate.respondedAt = new Date();
  }

  task.assignedHelperId = trustedPersonId;
  task.assignedCandidateModel = 'User';
  task.status = 'accepted';
  task.escalationLevel = 0;

  await task.save();

  return {
    taskId: task._id,
    status: task.status,
    assignedHelperId: task.assignedHelperId
  };
}

module.exports = {
  activateBackupChain,
  getNextBackupCandidate,
  getProfessionalCandidates,
  handleEmergency,
  escalateTask,
  assignFromTrustedNetwork
};
