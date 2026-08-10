const Task = require('../models/Task');
const TrustedPerson = require('../models/TrustedPerson');
const HelperProfile = require('../models/HelperProfile');
const EmergencyService = require('../models/EmergencyService');
const { haversineDistance, getDistanceCategory } = require('../utils/distance');
const scoring = require('../utils/scoring');
const {
  activateBackupChain,
  getNextBackupCandidate,
  getProfessionalCandidates
} = require('./backupChain');

class MatchingEngine {
  constructor() {
    this.NOTIFICATION_TIMEOUT_MS = Number(process.env.MATCH_TIMEOUT_MS) || 5 * 60 * 1000;
    this.MAX_BACKUPS_PER_TIER = 2;
    this.TRUSTED_TIER = 'trusted';
    this.PROFESSIONAL_TIER = 'professional';
    this.EMERGENCY_TIER = 'emergency';
    this.TIER_ORDER = [this.TRUSTED_TIER, this.PROFESSIONAL_TIER, this.EMERGENCY_TIER];
  }

  async findMatches(taskId) {
    const task = await Task.findById(taskId).populate('seniorId', 'name address');
    if (!task) throw new Error('Task not found');

    const candidates = await this._getCandidates(task);
    const chain = this._rankCandidates(task, candidates);
    const trustedChain = chain.filter(c => c.tier === this.TRUSTED_TIER);

    task.matchingCandidates = [];

    if (trustedChain.length > 0 && task.category !== 'emergency') {
      this._appendTierCandidates(task, trustedChain, { notifyPrimary: true });
    } else {
      this._appendTierCandidates(task, chain, { notifyPrimary: true });
      task.escalationLevel = task.category === 'emergency' ? 1 : task.escalationLevel || 0;
    }

    task.status = task.matchingCandidates.length > 0 ? 'searching' : 'escalated';
    const primary = task.matchingCandidates.find(c => c.isPrimary);
    task.assignedHelperId = primary?.helperId || null;
    task.assignedCandidateModel = primary?.candidateModel || 'User';
    if (!primary) task.familyNotified = true;

    await task.save();
    this._scheduleNotificationTimeout(task._id);

    return this._formatMatchResult(task, chain);
  }

  async _getCandidates(task) {
    const trusted = await this._getTrustedCandidates(task);
    const trustedUserIds = trusted.map(c => c.helperId);

    const professionals = await this._getProfessionalCandidates(task, trustedUserIds);
    const emergency = await this._getEmergencyCandidates(task);

    return [...trusted, ...professionals, ...emergency];
  }

  async _getTrustedCandidates(task) {
    const trustedPeople = await TrustedPerson.find({
      seniorId: task.seniorId,
      approved: true,
      availability: { $ne: 'offline' },
      skills: { $in: [task.requiredSkill] }
    });

    const trustedUserIds = trustedPeople.map(tp => tp.userId).filter(Boolean);
    if (trustedUserIds.length === 0) return [];

    const profiles = await HelperProfile.find({
      userId: { $in: trustedUserIds },
      isActive: true,
      'availability.status': { $ne: 'offline' },
      skills: { $in: [task.requiredSkill, task.category] }
    }).populate('userId', 'name phone address');

    return profiles.map(profile => {
      const trustedPerson = trustedPeople.find(tp => (
        tp.userId?.toString() === profile.userId?._id?.toString()
      ));

      return {
        ...profile.toObject(),
        helperId: profile.userId._id,
        candidateModel: 'User',
        tier: this.TRUSTED_TIER,
        name: profile.userId.name,
        phone: profile.userId.phone,
        trustScore: trustedPerson?.trustScore || profile.trustScore,
        relationship: trustedPerson?.relationship
      };
    });
  }

  async _getProfessionalCandidates(task, excludedUserIds) {
    const profiles = await getProfessionalCandidates(task, excludedUserIds);

    return profiles.map(profile => ({
      ...profile.toObject(),
      helperId: profile.userId._id,
      candidateModel: 'User',
      tier: this.PROFESSIONAL_TIER,
      name: profile.userId.name,
      phone: profile.userId.phone,
      trustScore: profile.trustScore || 60
    }));
  }

  async _getEmergencyCandidates(task) {
    const services = await EmergencyService.find({
      isActive: true,
      isVerified: true,
      'availability.status': { $ne: 'offline' },
      services: { $in: [task.category, task.requiredSkill, 'all'] },
      type: { $in: ['ngo', 'college-volunteer', 'government'] }
    });

    return services.map(service => ({
      ...service.toObject(),
      helperId: service._id,
      candidateModel: 'EmergencyService',
      tier: this.EMERGENCY_TIER,
      name: service.name,
      phone: service.phone,
      skills: service.services,
      serviceType: service.organization,
      trustScore: Math.round((service.rating?.average || 3.5) * 20)
    }));
  }

  _rankCandidates(task, candidates) {
    return candidates
      .map(candidate => this._scoreCandidate(task, candidate))
      .filter(candidate => candidate.compositeScore > 0)
      .sort((a, b) => {
        const tierDelta = this.TIER_ORDER.indexOf(a.tier) - this.TIER_ORDER.indexOf(b.tier);
        if (tierDelta !== 0) return tierDelta;

        if (a.tier === this.TRUSTED_TIER && a.distance !== b.distance) {
          return a.distance - b.distance;
        }

        return b.compositeScore - a.compositeScore;
      });
  }

  _scoreCandidate(task, candidate) {
    const distance = this._calculateDistance(
      task.location?.coordinates,
      candidate.location?.coordinates
    );
    const skillScore = scoring.calculateSkillMatch(task.requiredSkill, candidate.skills);
    const trustScore = candidate.trustScore || 0;
    const availabilityScore = scoring.calculateAvailabilityScore(
      candidate.availability?.status || candidate.availability || 'offline'
    );
    const distanceScore = scoring.calculateDistanceScore(distance, candidate.serviceRadius || 10);
    const compositeScore = scoring.calculateCompositeScore(
      skillScore,
      trustScore,
      availabilityScore,
      distanceScore
    );

    return {
      helperId: candidate.helperId,
      userId: candidate.candidateModel === 'User' ? candidate.helperId : null,
      candidateModel: candidate.candidateModel,
      name: candidate.name,
      phone: candidate.phone || '',
      service: candidate.serviceType || candidate.services?.join(', '),
      skills: candidate.skills,
      trustScore,
      availability: candidate.availability?.status || candidate.availability || 'offline',
      distance,
      distanceCategory: getDistanceCategory(distance, candidate.serviceRadius || 10),
      skillScore,
      availabilityScore,
      distanceScore,
      compositeScore,
      tier: candidate.tier,
      type: candidate.type || 'helper'
    };
  }

  _appendTierCandidates(task, rankedCandidates, { notifyPrimary }) {
    const currentCountByTier = {};

    for (const candidate of rankedCandidates) {
      currentCountByTier[candidate.tier] = currentCountByTier[candidate.tier] || 0;
      if (currentCountByTier[candidate.tier] > this.MAX_BACKUPS_PER_TIER) continue;

      const shouldNotify = notifyPrimary && !task.matchingCandidates.some(c => c.isPrimary);
      task.matchingCandidates.push({
        helperId: candidate.helperId,
        candidateModel: candidate.candidateModel,
        tier: candidate.tier,
        score: candidate.compositeScore,
        isPrimary: shouldNotify,
        isBackup: !shouldNotify,
        status: shouldNotify ? 'notified' : 'pending',
        notifiedAt: shouldNotify ? new Date() : null,
        notificationExpiresAt: shouldNotify ? this._notificationExpiresAt() : null
      });

      currentCountByTier[candidate.tier] += 1;
    }
  }

  async handleRejection(taskId, helperId) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    const candidate = task.matchingCandidates.find(
      c => c.helperId.toString() === helperId.toString()
    );

    if (candidate) {
      candidate.status = 'rejected';
      candidate.respondedAt = new Date();
      candidate.isPrimary = false;
      candidate.isBackup = false;
    }

    const nextBackup = getNextBackupCandidate(task.matchingCandidates, helperId);
    if (nextBackup) {
      nextBackup.notificationExpiresAt = this._notificationExpiresAt();
      await activateBackupChain(task, nextBackup);
      this._scheduleNotificationTimeout(task._id);
    } else if (this._allTrustedExhausted(task)) {
      await this.activateEmergencyServices(task);
    } else {
      task.assignedHelperId = null;
      task.assignedCandidateModel = 'User';
      task.status = 'escalated';
      task.escalationLevel = (task.escalationLevel || 0) + 1;
      task.familyNotified = true;
      await task.save();
    }

    return this._taskState(task);
  }

  async handleNotificationTimeout(taskId) {
    const task = await Task.findById(taskId);
    if (!task || task.status !== 'searching') return null;

    const currentPrimary = task.matchingCandidates.find(c => c.isPrimary && c.status === 'notified');
    if (!currentPrimary || !currentPrimary.notificationExpiresAt) return this._taskState(task);
    if (currentPrimary.notificationExpiresAt > new Date()) return this._taskState(task);

    currentPrimary.status = 'expired';
    currentPrimary.isPrimary = false;
    currentPrimary.isBackup = false;

    const nextBackup = getNextBackupCandidate(task.matchingCandidates, currentPrimary.helperId);
    if (nextBackup) {
      nextBackup.notificationExpiresAt = this._notificationExpiresAt();
      await activateBackupChain(task, nextBackup);
      this._scheduleNotificationTimeout(task._id);
    } else {
      await this.activateEmergencyServices(task);
    }

    return this._taskState(task);
  }

  async activateEmergencyServices(task) {
    const existingIds = new Set(task.matchingCandidates.map(c => c.helperId.toString()));
    const chain = this._rankCandidates(task, [
      ...await this._getProfessionalCandidates(task, [...existingIds]),
      ...await this._getEmergencyCandidates(task)
    ]).filter(c => !existingIds.has(c.helperId.toString()));

    this._appendTierCandidates(task, chain, { notifyPrimary: true });

    const primary = task.matchingCandidates.find(c => c.isPrimary && c.status === 'notified');
    task.assignedHelperId = primary?.helperId || null;
    task.assignedCandidateModel = primary?.candidateModel || 'User';
    task.status = primary ? 'searching' : 'escalated';
    task.escalationLevel = (task.escalationLevel || 0) + 1;
    task.familyNotified = !primary;

    await task.save();
    this._scheduleNotificationTimeout(task._id);

    return primary;
  }

  async handleAcceptance(taskId, helperId) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    let acceptedCandidate = null;
    task.matchingCandidates.forEach(candidate => {
      if (candidate.helperId.toString() === helperId.toString()) {
        candidate.status = 'accepted';
        candidate.respondedAt = new Date();
        candidate.isPrimary = true;
        candidate.isBackup = false;
        acceptedCandidate = candidate;
      } else if (candidate.status === 'notified') {
        candidate.status = 'expired';
        candidate.isPrimary = false;
      }
    });

    task.assignedHelperId = helperId;
    task.assignedCandidateModel = acceptedCandidate?.candidateModel || 'User';
    task.status = 'accepted';

    await task.save();
    return this._taskState(task);
  }

  async getTaskMatches(taskId) {
    await this.handleNotificationTimeout(taskId);

    const task = await Task.findById(taskId)
      .populate('seniorId', 'name')
      .populate('matchingCandidates.helperId', 'name phone organization type');

    if (!task) throw new Error('Task not found');

    const primary = task.matchingCandidates.find(c => c.isPrimary);
    const backups = task.matchingCandidates.filter(c => c.isBackup);

    return {
      ...this._taskState(task),
      primary: primary || null,
      backups,
      chain: task.matchingCandidates.map((c, i) => ({
        position: i + 1,
        helperId: c.helperId,
        tier: c.tier,
        candidateModel: c.candidateModel,
        status: c.status,
        isPrimary: c.isPrimary,
        notificationExpiresAt: c.notificationExpiresAt
      }))
    };
  }

  _allTrustedExhausted(task) {
    const trusted = task.matchingCandidates.filter(c => c.tier === this.TRUSTED_TIER);
    return trusted.length > 0 && trusted.every(c => ['rejected', 'expired'].includes(c.status));
  }

  _calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2 || loc1.lat == null || loc1.lng == null || loc2.lat == null || loc2.lng == null) {
      return Infinity;
    }
    return haversineDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
  }

  _notificationExpiresAt() {
    return new Date(Date.now() + this.NOTIFICATION_TIMEOUT_MS);
  }

  _scheduleNotificationTimeout(taskId) {
    setTimeout(() => {
      this.handleNotificationTimeout(taskId).catch(error => {
        console.error(`[MATCHING TIMEOUT ERROR] ${taskId}:`, error.message);
      });
    }, this.NOTIFICATION_TIMEOUT_MS + 1000).unref?.();
  }

  _formatMatchResult(task, chain) {
    const primary = chain.find(candidate =>
      task.matchingCandidates.some(saved =>
        saved.isPrimary && saved.helperId.toString() === candidate.helperId.toString()
      )
    ) || null;
    const backups = chain.filter(candidate =>
      task.matchingCandidates.some(saved =>
        saved.isBackup && saved.helperId.toString() === candidate.helperId.toString()
      )
    );

    return {
      ...this._taskState(task),
      matches: {
        primary,
        backup1: backups[0] || null,
        backup2: backups[1] || null
      },
      totalCandidates: chain.length,
      chain: chain.map((c, i) => ({
        position: i + 1,
        name: c.name,
        tier: c.tier,
        score: c.compositeScore,
        distance: c.distance
      }))
    };
  }

  _taskState(task) {
    return {
      taskId: task._id,
      status: task.status,
      assignedHelperId: task.assignedHelperId,
      assignedCandidateModel: task.assignedCandidateModel,
      escalationLevel: task.escalationLevel
    };
  }
}

module.exports = new MatchingEngine();
