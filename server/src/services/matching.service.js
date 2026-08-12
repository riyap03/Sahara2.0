const ServiceProvider = require('../models/ServiceProvider');
const TrustedContact = require('../models/TrustedContact');
const User = require('../models/User');

const findBestMatch = async (request) => {
  const { type, senior, location } = request;

  let bestMatch = null;
  let bestLevel = 1;

  const trustedContacts = await TrustedContact.find({
    senior,
    isApproved: true
  }).populate('contact', 'name phone role isAvailable location');

  for (const contact of trustedContacts.sort((a, b) => a.priority - b.priority)) {
    if (contact.contact && contact.contact.isAvailable) {
      bestMatch = {
        level: 1,
        matchType: 'trusted_contact',
        helper: contact.contact,
        reason: 'Trusted contact available'
      };
      bestLevel = 1;
      break;
    }
  }

  if (!bestMatch) {
    const providers = await ServiceProvider.find({
      serviceType: type,
      isAvailable: true,
      isVerified: true
    }).populate('user', 'name phone location isAvailable');

    let bestScore = 0;

    for (const provider of providers) {
      const score = calculateMatchScore(provider, location);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          level: 3,
          matchType: 'service_provider',
          helper: provider.user,
          provider,
          reason: 'Verified service provider available nearby',
          score
        };
        bestLevel = 3;
      }
    }
  }

  if (!bestMatch) {
    bestMatch = {
      level: 4,
      matchType: 'emergency',
      helper: null,
      reason: 'No suitable helper found, escalation required'
    };
    bestLevel = 4;
  }

  return bestMatch;
};

const calculateMatchScore = (provider, requestLocation) => {
  if (!provider.location || !requestLocation) return 0;

  const distance = haversineDistance(
    provider.location.lat,
    provider.location.lng,
    requestLocation.lat,
    requestLocation.lng
  );

  let score = 0;

  if (provider.isVerified) score += 40;
  if (provider.isAvailable) score += 15;
  if (distance < 5) score += 25;
  else if (distance < 10) score += 15;
  else if (distance < 20) score += 5;

  score += Math.min(provider.rating * 2, 10);
  score += Math.min(provider.totalTasks * 0.1, 10);

  return score;
};

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

module.exports = {
  findBestMatch,
  calculateMatchScore,
  haversineDistance
};
