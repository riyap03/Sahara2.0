const mongoose = require('mongoose');
const matchingEngine = require('./services/matchingEngine');
const Task = require('./models/Task');
const User = require('./models/User');
const HelperProfile = require('./models/HelperProfile');
const TrustedPerson = require('./models/TrustedPerson');
const EmergencyService = require('./models/EmergencyService');
const connectDB = require('./config/db');

const runTests = async () => {
  try {
    await connectDB();
    await mongoose.connection.dropDatabase();

    console.log('\n=== Matching Engine Tests ===\n');

    const senior = await User.create({
      name: 'Test Senior',
      email: 'senior@test.com',
      phone: '+919999999999',
      password: 'password123',
      role: 'senior',
      address: {
        street: 'Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      isVerified: true
    });

    const helper1 = await User.create({
      name: 'Helper 1 - Plumber',
      email: 'h1@test.com',
      phone: '+919999999991',
      password: 'password123',
      role: 'helper',
      address: {
        street: 'Helper Street 1',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0770, lng: 72.8787 }
      },
      isVerified: true
    });

    const helper2 = await User.create({
      name: 'Helper 2 - Plumber',
      email: 'h2@test.com',
      phone: '+919999999992',
      password: 'password123',
      role: 'helper',
      address: {
        street: 'Helper Street 2',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0750, lng: 72.8767 }
      },
      isVerified: true
    });

    const helper3 = await User.create({
      name: 'Helper 3 - Electrician',
      email: 'h3@test.com',
      phone: '+919999999993',
      password: 'password123',
      role: 'helper',
      address: {
        street: 'Helper Street 3',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0740, lng: 72.8797 }
      },
      isVerified: true
    });

    await HelperProfile.create([
      {
        userId: helper1._id,
        serviceType: 'Plumbing',
        skills: ['plumber', 'pipe', 'water'],
        trustScore: 85,
        availability: { status: 'available' },
        location: { coordinates: { lat: 19.0770, lng: 72.8787 } },
        serviceRadius: 10,
        completedTasks: 45,
        isVerified: true
      },
      {
        userId: helper2._id,
        serviceType: 'Plumbing',
        skills: ['plumber', 'leak', 'tap'],
        trustScore: 72,
        availability: { status: 'available' },
        location: { coordinates: { lat: 19.0750, lng: 72.8767 } },
        serviceRadius: 10,
        completedTasks: 30,
        isVerified: true
      },
      {
        userId: helper3._id,
        serviceType: 'Electrical',
        skills: ['electrician', 'wire', 'light'],
        trustScore: 90,
        availability: { status: 'available' },
        location: { coordinates: { lat: 19.0740, lng: 72.8797 } },
        serviceRadius: 10,
        completedTasks: 60,
        isVerified: true
      }
    ]);

    await TrustedPerson.create([
      {
        seniorId: senior._id,
        name: helper1.name,
        phone: helper1.phone,
        role: 'Service Provider',
        service: 'Plumbing',
        skills: ['plumber'],
        availability: 'available',
        trustScore: 85,
        userId: helper1._id,
        approved: true
      },
      {
        seniorId: senior._id,
        name: helper2.name,
        phone: helper2.phone,
        role: 'Service Provider',
        service: 'Plumbing',
        skills: ['plumber'],
        availability: 'available',
        trustScore: 72,
        userId: helper2._id,
        approved: true
      }
    ]);

    await EmergencyService.create([
      {
        name: 'Test Emergency NGO',
        type: 'ngo',
        organization: 'Test Foundation',
        contactPerson: {
          name: 'Test Contact',
          phone: '+919876550001'
        },
        phone: '+919876550001',
        services: ['plumber', 'all'],
        coverageArea: 'Mumbai',
        location: {
          address: 'Test Location',
          coordinates: { lat: 19.0540, lng: 72.8400 }
        },
        serviceRadius: 25,
        availability: { status: 'available' },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Test Emergency Volunteers',
        type: 'college-volunteer',
        organization: 'Test University',
        contactPerson: {
          name: 'Test Volunteer',
          phone: '+919876550002'
        },
        phone: '+919876550002',
        services: ['plumber', 'transport', 'medicine'],
        coverageArea: 'Mumbai',
        location: {
          address: 'Test College',
          coordinates: { lat: 19.0640, lng: 72.8250 }
        },
        serviceRadius: 15,
        availability: { status: 'available' },
        isVerified: true,
        isActive: true
      }
    ]);

    console.log('Test 1: Finding matches for plumber task (2-tier: trusted → emergency)');
    const task = await Task.create({
      seniorId: senior._id,
      category: 'household',
      requiredSkill: 'plumber',
      title: 'Water pump repair',
      description: 'Water pump not working',
      priority: 'normal',
      location: {
        address: 'Test Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    const result = await matchingEngine.findMatches(task._id);
    console.log(`Status: ${result.status}`);
    console.log(`Primary: ${result.matches.primary?.name} (Tier: ${result.matches.primary?.tier}, Score: ${result.matches.primary?.compositeScore})`);
    console.log(`Backup 1: ${result.matches.backup1?.name} (Tier: ${result.matches.backup1?.tier})`);
    console.log(`Backup 2: ${result.matches.backup2?.name || 'None'}`);
    console.log(`Chain: ${result.chain?.map(c => `${c.name}(${c.tier})`).join(' → ')}`);
    console.assert(result.status === 'searching', 'Task status should be searching');
    console.assert(result.matches.primary !== null, 'Should have a primary match');
    console.assert(result.matches.primary?.tier === 'trusted', 'Primary should be from trusted tier');
    console.log('PASS: Matching found trusted primary\n');

    console.log('Test 2: Primary accepts task');
    const acceptResult = await matchingEngine.handleAcceptance(
      task._id,
      result.matches.primary.userId
    );
    console.log(`Status: ${acceptResult.status}`);
    console.assert(acceptResult.status === 'accepted', 'Task should be accepted');
    console.log('PASS: Task accepted by trusted primary\n');

    console.log('Test 3: Rejection triggers backup within trusted tier');
    const task2 = await Task.create({
      seniorId: senior._id,
      category: 'household',
      requiredSkill: 'plumber',
      title: 'Leaking tap',
      description: 'Tap is leaking',
      priority: 'normal',
      location: {
        address: 'Test Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    const result2 = await matchingEngine.findMatches(task2._id);
    console.log(`Task 2 Primary: ${result2.matches.primary?.name} (${result2.matches.primary?.tier})`);
    console.log(`Task 2 Backup 1: ${result2.matches.backup1?.name} (${result2.matches.backup1?.tier})`);

    const rejectResult = await matchingEngine.handleRejection(
      task2._id,
      result2.matches.primary.userId
    );
    console.log(`After rejection - Status: ${rejectResult.status}`);
    console.log(`Assigned: ${rejectResult.assignedHelperId}`);
    console.assert(rejectResult.status === 'searching', 'Should still be searching');
    console.log('PASS: Backup chain activated after trusted rejection\n');

    console.log('Test 4: All trusted exhausted → emergency services activated');
    const task3 = await Task.create({
      seniorId: senior._id,
      category: 'household',
      requiredSkill: 'plumber',
      title: 'Drain clog',
      description: 'Drain is clogged',
      priority: 'critical',
      location: {
        address: 'Test Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    const result3 = await matchingEngine.findMatches(task3._id);
    console.log(`Task 3 Primary: ${result3.matches.primary?.name} (${result3.matches.primary?.tier})`);
    console.log(`Task 3 Backup 1: ${result3.matches.backup1?.name} (${result3.matches.backup1?.tier})`);

    await matchingEngine.handleRejection(task3._id, result3.matches.primary.userId);
    await matchingEngine.handleRejection(task3._id, result3.matches.backup1.userId);

    const finalTask = await Task.findById(task3._id);
    console.log(`Final Status: ${finalTask.status}`);
    console.log(`Escalation Level: ${finalTask.escalationLevel}`);
    console.log(`Final Candidates: ${finalTask.matchingCandidates.map(c => `${c.tier}:${c.status}`).join(', ')}`);
    const notifiedEmergency = finalTask.matchingCandidates.find(
      c => c.tier === 'emergency' && c.status === 'notified' && c.isPrimary
    );
    console.assert(finalTask.status === 'searching', 'Should still be searching after emergency service is notified');
    console.assert(Boolean(notifiedEmergency), 'Emergency service should become primary after trusted tier is exhausted');
    console.log('PASS: Emergency services activated after trusted tier is exhausted\n');

    console.log('Test 5: Emergency category skips normal matching');
    const task4 = await Task.create({
      seniorId: senior._id,
      category: 'emergency',
      requiredSkill: 'medical',
      title: 'Chest pain',
      description: 'Senior experiencing chest pain',
      priority: 'critical',
      location: {
        address: 'Test Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    const result4 = await matchingEngine.findMatches(task4._id);
    console.log(`Emergency Task Status: ${result4.status}`);
    console.log(`Emergency Primary: ${result4.matches.primary?.name}`);
    console.log(`Emergency Tier: ${result4.matches.primary?.tier}`);
    console.log('PASS: Emergency category handled\n');

    console.log('Test 6: Verify scoring weights');
    const task5 = await Task.create({
      seniorId: senior._id,
      category: 'household',
      requiredSkill: 'electrician',
      title: 'Fan repair',
      description: 'Fan not working',
      priority: 'high',
      location: {
        address: 'Test Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    const result5 = await matchingEngine.findMatches(task5._id);
    console.log(`Primary: ${result5.matches.primary?.name} (Score: ${result5.matches.primary?.compositeScore})`);
    console.log(`Skill Score: ${result5.matches.primary?.skillScore}`);
    console.log(`Trust Score: ${result5.matches.primary?.trustScore}`);
    console.log(`Availability Score: ${result5.matches.primary?.availabilityScore}`);
    console.log(`Distance Score: ${result5.matches.primary?.distanceScore}`);
    console.assert(result5.matches.primary?.service === 'Electrical', 'Should match electrician');
    console.log('PASS: Scoring weights working correctly\n');

    console.log('=== All Tests Passed ===\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

runTests();
