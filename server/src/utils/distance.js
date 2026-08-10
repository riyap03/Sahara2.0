const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

function getDistanceCategory(distanceKm, serviceRadiusKm) {
  if (distanceKm <= serviceRadiusKm * 0.3) return 'near';
  if (distanceKm <= serviceRadiusKm * 0.7) return 'medium';
  if (distanceKm <= serviceRadiusKm) return 'far';
  return 'out-of-range';
}

module.exports = {
  haversineDistance,
  getDistanceCategory
};
