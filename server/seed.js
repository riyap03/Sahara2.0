require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const TrustedContact = require('./models/TrustedContact');
const ServiceProvider = require('./models/ServiceProvider');
const HelpRequest = require('./models/HelpRequest');
const Task = require('./models/Task');
const Notification = require('./models/Notification');
const EmergencyContact = require('./models/EmergencyContact');

const seedDatabase = async () => {
  try {
    await connectDB();
    await mongoose.connection.dropDatabase();

    const hashPassword = async (password) => bcrypt.hash(password, 12);

    const senior = await User.create({
      name: 'Rajesh Sharma',
      email: 'rajesh@example.com',
      phone: '+919876543210',
      password: await hashPassword('password123'),
      role: 'senior',
      language: 'Hindi',
      address: {
        street: '12, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017'
      },
      location: { lat: 26.9124, lng: 75.7873 },
      isVerified: true,
      isAvailable: true
    });

    const family1 = await User.create({
      name: 'Neha Sharma',
      email: 'neha@example.com',
      phone: '+919876543211',
      password: await hashPassword('password123'),
      role: 'family',
      language: 'Hindi',
      address: {
        street: '12, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017'
      },
      location: { lat: 26.9124, lng: 75.7873 },
      isVerified: true,
      isAvailable: true
    });

    const family2 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+919876543212',
      password: await hashPassword('password123'),
      role: 'family',
      language: 'Hindi',
      address: {
        street: '12, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017'
      },
      location: { lat: 26.9124, lng: 75.7873 },
      isVerified: true,
      isAvailable: true
    });

    const neighbour = await User.create({
      name: 'Amit Verma',
      email: 'amit@example.com',
      phone: '+919876543213',
      password: await hashPassword('password123'),
      role: 'volunteer',
      language: 'Hindi',
      address: {
        street: '15, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017'
      },
      location: { lat: 26.9134, lng: 75.7883 },
      isVerified: true,
      isAvailable: true
    });

    const doctor = await User.create({
      name: 'Dr. Priya Singh',
      email: 'priya@example.com',
      phone: '+919876543214',
      password: await hashPassword('password123'),
      role: 'provider',
      language: 'Hindi',
      address: {
        street: '5, Tonk Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302015'
      },
      location: { lat: 26.9050, lng: 75.7800 },
      isVerified: true,
      isAvailable: true
    });

    const plumberUser = await User.create({
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      phone: '+919876543215',
      password: await hashPassword('password123'),
      role: 'provider',
      language: 'Hindi',
      address: {
        street: '20, C-Scheme',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001'
      },
      location: { lat: 26.9200, lng: 75.7900 },
      isVerified: true,
      isAvailable: true
    });

    const electricianUser = await User.create({
      name: 'Suresh Yadav',
      email: 'suresh@example.com',
      phone: '+919876543216',
      password: await hashPassword('password123'),
      role: 'provider',
      language: 'Hindi',
      address: {
        street: '30, Raja Park',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302004'
      },
      location: { lat: 26.9150, lng: 75.7950 },
      isVerified: true,
      isAvailable: true
    });

    const caregiverUser = await User.create({
      name: 'Pooja Mehta',
      email: 'pooja@example.com',
      phone: '+919876543217',
      password: await hashPassword('password123'),
      role: 'provider',
      language: 'Hindi',
      address: {
        street: '8, Vaishali Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302021'
      },
      location: { lat: 26.9250, lng: 75.7850 },
      isVerified: true,
      isAvailable: true
    });

    const plumberProvider = await ServiceProvider.create({
      user: plumberUser._id,
      serviceType: 'plumber',
      experience: 8,
      rating: 4.5,
      totalTasks: 120,
      isVerified: true,
      verificationStatus: 'verified',
      isAvailable: true,
      emergencyAvailable: true,
      location: { lat: 26.9200, lng: 75.7900 },
      serviceArea: 'Jaipur City'
    });

    const electricianProvider = await ServiceProvider.create({
      user: electricianUser._id,
      serviceType: 'electrician',
      experience: 10,
      rating: 4.8,
      totalTasks: 95,
      isVerified: true,
      verificationStatus: 'verified',
      isAvailable: true,
      emergencyAvailable: false,
      location: { lat: 26.9150, lng: 75.7950 },
      serviceArea: 'Jaipur City'
    });

    const caregiverProvider = await ServiceProvider.create({
      user: caregiverUser._id,
      serviceType: 'caregiver',
      experience: 5,
      rating: 4.2,
      totalTasks: 60,
      isVerified: true,
      verificationStatus: 'verified',
      isAvailable: true,
      emergencyAvailable: true,
      location: { lat: 26.9250, lng: 75.7850 },
      serviceArea: 'Jaipur City'
    });

    const trustedContact1 = await TrustedContact.create({
      senior: senior._id,
      contact: neighbour._id,
      relation: 'neighbour',
      priority: 1,
      isApproved: true,
      emergencyAvailable: true
    });

    const trustedContact2 = await TrustedContact.create({
      senior: senior._id,
      contact: doctor._id,
      relation: 'doctor',
      priority: 2,
      isApproved: true,
      emergencyAvailable: true
    });

    const emergencyContact = await EmergencyContact.create({
      name: 'Neha Sharma',
      phone: '+919876543211',
      relation: 'Daughter',
      isPrimary: true,
      user: senior._id
    });

    const request1 = await HelpRequest.create({
      senior: senior._id,
      type: 'plumbing',
      description: 'Mera pump kharab ho gaya hai',
      priority: 'normal',
      status: 'pending',
      location: { lat: 26.9124, lng: 75.7873 }
    });

    const request2 = await HelpRequest.create({
      senior: senior._id,
      type: 'hospital',
      description: 'Mere husband achanak gir gaye hain',
      priority: 'critical',
      status: 'pending',
      location: { lat: 26.9124, lng: 75.7873 }
    });

    console.log('\n=== Database Seeded Successfully ===\n');
    console.log(`Senior: ${senior.name} (${senior._id})`);
    console.log(`Family: ${family1.name}, ${family2.name}`);
    console.log(`Neighbour: ${neighbour.name}`);
    console.log(`Doctor: ${doctor.name}`);
    console.log(`Providers: ${plumberUser.name}, ${electricianUser.name}, ${caregiverUser.name}`);
    console.log(`\nTrusted Contacts: ${trustedContact1.relation}, ${trustedContact2.relation}`);
    console.log(`Emergency Contact: ${emergencyContact.name}`);
    console.log(`\nRequests: ${request1.type} (${request1._id}), ${request2.type} (${request2._id})`);
    console.log('\nProvider IDs (for testing):');
    console.log(`  Plumber: ${plumberUser._id}`);
    console.log(`  Electrician: ${electricianUser._id}`);
    console.log(`  Caregiver: ${caregiverUser._id}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
