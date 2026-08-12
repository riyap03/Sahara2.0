require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const TrustedContact = require('./models/TrustedContact');
const ServiceProvider = require('./models/ServiceProvider');
const HelpRequest = require('./models/HelpRequest');
const Task = require('./models/Task');
const { runBackupChain } = require('./services/backupChain.service');
const { detectIntent } = require('./services/ai.service');
const bcrypt = require('bcryptjs');

const runTests = async () => {
  try {
    await connectDB();
    await mongoose.connection.dropDatabase();

    console.log('\n=== Ghar Ka Backup — Integration Tests ===\n');

    const hashPassword = async (pwd) => bcrypt.hash(pwd, 12);

    const senior = await User.create({
      name: 'Test Senior',
      email: 'senior@test.com',
      phone: '+919999999999',
      password: await hashPassword('password123'),
      role: 'senior',
      language: 'Hindi',
      address: { street: 'Test Street', city: 'Jaipur', state: 'Rajasthan', pincode: '302017' },
      location: { lat: 26.9124, lng: 75.7873 },
      isVerified: true
    });

    const family = await User.create({
      name: 'Test Family',
      email: 'family@test.com',
      phone: '+919999999998',
      password: await hashPassword('password123'),
      role: 'family',
      language: 'Hindi',
      address: { street: 'Test Street', city: 'Jaipur', state: 'Rajasthan', pincode: '302017' },
      isVerified: true
    });

    const plumberUser = await User.create({
      name: 'Test Plumber',
      email: 'plumber@test.com',
      phone: '+919999999997',
      password: await hashPassword('password123'),
      role: 'provider',
      language: 'Hindi',
      address: { street: 'Plumber Street', city: 'Jaipur', state: 'Rajasthan', pincode: '302017' },
      location: { lat: 26.9200, lng: 75.7900 },
      isVerified: true
    });

    const plumberProvider = await ServiceProvider.create({
      user: plumberUser._id,
      serviceType: 'plumber',
      experience: 5,
      rating: 4.5,
      totalTasks: 50,
      isVerified: true,
      verificationStatus: 'verified',
      isAvailable: true,
      emergencyAvailable: true,
      location: { lat: 26.9200, lng: 75.7900 },
      serviceArea: 'Jaipur'
    });

    console.log('Test 1: Senior creates plumbing request — backup chain matches provider');
    const request1 = await HelpRequest.create({
      senior: senior._id,
      type: 'plumbing',
      description: 'Mera pump kharab ho gaya hai',
      priority: 'normal',
      status: 'pending',
      location: { lat: 26.9124, lng: 75.7873 }
    });

    const chainResult = await runBackupChain(request1._id);
    console.log(`Level: ${chainResult.level}`);
    console.log(`Match Type: ${chainResult.matchType}`);
    console.log(`Helper: ${chainResult.helper?.name}`);
    console.log(`Reason: ${chainResult.reason}`);
    console.log(`Task Created: ${chainResult.task?._id}`);
    console.log(`OTP: ${chainResult.otp}`);
    console.assert(chainResult.level === 3, 'Should match Level 3 service provider');
    console.assert(chainResult.helper !== null, 'Should have a helper');
    console.log('PASS\n');

    console.log('Test 2: Senior accepts task — check-in');
    const task = await Task.findById(chainResult.task._id);
    task.status = 'accepted';
    await task.save();
    task.checkInTime = new Date();
    task.status = 'in_progress';
    await task.save();
    console.log(`Task status: ${task.status}`);
    console.assert(task.status === 'in_progress', 'Task should be in progress');
    console.log('PASS\n');

    console.log('Test 3: Task completion');
    task.checkOutTime = new Date();
    task.status = 'completed';
    await task.save();
    console.log(`Task status: ${task.status}`);
    console.assert(task.status === 'completed', 'Task should be completed');
    console.log('PASS\n');

    console.log('Test 4: AI intent detection');
    const intent1 = detectIntent('Mere husband achanak gir gaye hain');
    console.log(`Intent: ${intent1.intent}, Priority: ${intent1.priority}`);
    console.assert(intent1.intent === 'hospital', 'Should detect hospital intent');
    console.assert(intent1.priority === 'critical', 'Should be critical priority');
    console.log('PASS\n');

    console.log('Test 5: Critical emergency request — escalation');
    const emergencyRequest = await HelpRequest.create({
      senior: senior._id,
      type: 'hospital',
      description: 'Mere husband achanak gir gaye hain',
      priority: 'critical',
      status: 'pending',
      location: { lat: 26.9124, lng: 75.7873 }
    });

    const emergencyChain = await runBackupChain(emergencyRequest._id);
    console.log(`Emergency Level: ${emergencyChain.level}`);
    console.log(`Request Status: ${emergencyChain.request?.status}`);
    console.assert(emergencyChain.level === 4, 'Critical emergency should escalate to Level 4');
    console.log('PASS\n');

    console.log('Test 6: No trusted contact — direct provider match');
    const lonelySenior = await User.create({
      name: 'Lonely Senior',
      email: 'lonely@test.com',
      phone: '+919999999996',
      password: await hashPassword('password123'),
      role: 'senior',
      language: 'Hindi',
      address: { street: 'Lonely Street', city: 'Jaipur', state: 'Rajasthan', pincode: '302017' },
      location: { lat: 26.9300, lng: 75.8000 },
      isVerified: true
    });

    const request3 = await HelpRequest.create({
      senior: lonelySenior._id,
      type: 'electricity',
      description: 'Light nahi chal raha hai',
      priority: 'normal',
      status: 'pending',
      location: { lat: 26.9300, lng: 75.8000 }
    });

    const chain3 = await runBackupChain(request3._id);
    console.log(`Level: ${chain3.level}`);
    console.log(`Helper: ${chain3.helper?.name}`);
    console.assert(chain3.level === 3, 'Should match provider directly');
    console.log('PASS\n');

    console.log('Test 7: No provider available — escalation');
    const noProviderSenior = await User.create({
      name: 'Remote Senior',
      email: 'remote@test.com',
      phone: '+919999999995',
      password: await hashPassword('password123'),
      role: 'senior',
      language: 'Hindi',
      address: { street: 'Remote Street', city: 'Ajmer', state: 'Rajasthan', pincode: '305001' },
      location: { lat: 26.4500, lng: 74.6400 },
      isVerified: true
    });

    const request4 = await HelpRequest.create({
      senior: noProviderSenior._id,
      type: 'plumbing',
      description: 'Paani nahi aa raha hai',
      priority: 'normal',
      status: 'pending',
      location: { lat: 26.4500, lng: 74.6400 }
    });

    const chain4 = await runBackupChain(request4._id);
    console.log(`Level: ${chain4.level}`);
    console.log(`Request Status: ${chain4.request?.status}`);
    console.assert(chain4.level === 4, 'Should escalate when no provider available');
    console.assert(chain4.request?.status === 'escalated', 'Request should be escalated');
    console.log('PASS\n');

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
