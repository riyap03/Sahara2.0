const detectIntent = (text) => {
  const lower = text.toLowerCase();

  const intentMap = {
    'plumber': { intent: 'plumbing', priority: 'normal', keywords: ['plumber', 'pump', 'pipe', 'leak', 'water', 'tap', 'drain'] },
    'electrician': { intent: 'electricity', priority: 'normal', keywords: ['electric', 'light', 'wire', 'fan', 'power', 'switch'] },
    'doctor': { intent: 'doctor', priority: 'high', keywords: ['doctor', 'clinic', 'checkup', 'appointment'] },
    'hospital': { intent: 'hospital', priority: 'critical', keywords: ['hospital', 'emergency', 'accident', 'pain', 'critical', 'gir', 'gir gaya', 'gir gayi', 'attack', 'heart', 'breath'] },
    'medicine': { intent: 'medicine', priority: 'normal', keywords: ['medicine', 'medication', 'pharmacy', 'pills', 'doctor'] },
    'grocery': { intent: 'grocery', priority: 'normal', keywords: ['grocery', 'vegetables', 'food', 'market', 'shopping'] },
    'transport': { intent: 'transport', priority: 'normal', keywords: ['car', 'taxi', 'bus', 'travel', 'drop', 'pickup'] },
    'bank': { intent: 'bank', priority: 'normal', keywords: ['bank', 'withdraw', 'deposit', 'passbook', 'atm'] },
    'government': { intent: 'government', priority: 'normal', keywords: ['government', 'document', 'aadhar', 'pan', 'ration', 'office'] },
    'repair': { intent: 'repair', priority: 'normal', keywords: ['repair', 'fix', 'broken', 'furniture', 'door', 'window'] },
    'house_help': { intent: 'house_help', priority: 'normal', keywords: ['maid', 'cleaning', 'cook', 'helper', 'housework'] }
  };

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, data] of Object.entries(intentMap)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lower.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = data;
    }
  }

  if (bestMatch) {
    return {
      intent: bestMatch.intent,
      priority: bestMatch.priority,
      description: text
    };
  }

  if (lower.includes('emergency') || lower.includes('help') || lower.includes('urgent')) {
    return {
      intent: 'hospital',
      priority: 'critical',
      description: text
    };
  }

  return {
    intent: 'other',
    priority: 'normal',
    description: text
  };
};

module.exports = {
  detectIntent
};
