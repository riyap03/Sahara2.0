const SKILL_MATCH_WEIGHT = 40;
const TRUST_SCORE_WEIGHT = 25;
const AVAILABILITY_WEIGHT = 20;
const DISTANCE_WEIGHT = 15;

const AVAILABILITY_SCORES = {
  available: 100,
  busy: 40,
  offline: 0
};

function calculateSkillMatch(requiredSkill, candidateSkills) {
  if (!candidateSkills || candidateSkills.length === 0) return 0;

  const normalizedRequired = requiredSkill.toLowerCase().trim();
  const normalizedSkills = candidateSkills.map(s => s.toLowerCase().trim());

  const exactMatch = normalizedSkills.some(skill => skill === normalizedRequired);
  if (exactMatch) return 100;

  const partialMatch = normalizedSkills.some(skill =>
    skill.includes(normalizedRequired) || normalizedRequired.includes(skill)
  );
  if (partialMatch) return 70;

  const categoryMatch = normalizedSkills.some(skill => {
    const related = getRelatedSkills(normalizedRequired);
    return related.includes(skill);
  });
  if (categoryMatch) return 50;

  return 0;
}

function getRelatedSkills(skill) {
  const skillMap = {
    'plumber': ['pipe', 'water', 'leak', 'drain', 'tap'],
    'electrician': ['wire', 'light', 'switch', 'fan', 'power'],
    'carpenter': ['wood', 'furniture', 'door', 'window', 'cabinet'],
    'doctor': ['health', 'medical', 'clinic', 'hospital', 'physician'],
    'driver': ['car', 'vehicle', 'transport', 'taxi', 'ride'],
    'caretaker': ['nurse', 'elderly', 'patient', 'medical'],
    'cleaner': ['maid', 'housekeeping', 'cleaning', 'sanitation'],
    'security': ['guard', 'watchman', 'protection']
  };

  const related = skillMap[skill] || [];
  return related;
}

function calculateAvailabilityScore(availabilityStatus) {
  return AVAILABILITY_SCORES[availabilityStatus] || 0;
}

function calculateDistanceScore(distanceKm, serviceRadiusKm) {
  if (distanceKm > serviceRadiusKm) return 0;

  const ratio = distanceKm / serviceRadiusKm;
  const score = Math.max(0, 100 - (ratio * 100));
  return Math.round(score);
}

function calculateCompositeScore(skillScore, trustScore, availabilityScore, distanceScore) {
  const weighted =
    (skillScore * SKILL_MATCH_WEIGHT / 100) +
    (trustScore * TRUST_SCORE_WEIGHT / 100) +
    (availabilityScore * AVAILABILITY_WEIGHT / 100) +
    (distanceScore * DISTANCE_WEIGHT / 100);

  return Math.round(weighted);
}

module.exports = {
  calculateSkillMatch,
  calculateAvailabilityScore,
  calculateDistanceScore,
  calculateCompositeScore,
  SKILL_MATCH_WEIGHT,
  TRUST_SCORE_WEIGHT,
  AVAILABILITY_WEIGHT,
  DISTANCE_WEIGHT
};
