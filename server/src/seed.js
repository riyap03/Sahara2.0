const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const HelperProfile = require('./models/HelperProfile');
const TrustedPerson = require('./models/TrustedPerson');
const EmergencyService = require('./models/EmergencyService');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const TASK_CATEGORIES = ['medical', 'transport', 'medicine', 'household', 'accompaniment', 'essentials', 'emergency'];

const seedDatabase = async () => {
  try {
    await connectDB();

    await mongoose.connection.dropDatabase();

    const senior = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      phone: '+919876543210',
      password: 'password123',
      role: 'senior',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      emergencyContact: {
        name: 'Priya Kumar',
        phone: '+919876543211',
        relation: 'Daughter'
      },
      isVerified: true
    });

    const family = await User.create({
      name: 'Priya Kumar',
      email: 'priya@example.com',
      phone: '+919876543211',
      password: 'password123',
      role: 'family',
      isVerified: true
    });

    const helpers = await User.create([
      {
        name: 'Rajesh Plumber',
        email: 'rajesh@example.com',
        phone: '+919876543212',
        password: 'password123',
        role: 'helper',
        address: {
          street: '456 Park Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { lat: 19.0770, lng: 72.8787 }
        },
        isVerified: true
      },
      {
        name: 'Amit Electrician',
        email: 'amit@example.com',
        phone: '+919876543213',
        password: 'password123',
        role: 'helper',
        address: {
          street: '789 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { lat: 19.0750, lng: 72.8767 }
        },
        isVerified: true
      },
      {
        name: 'Suresh Driver',
        email: 'suresh@example.com',
        phone: '+919876543214',
        password: 'password123',
        role: 'helper',
        address: {
          street: '321 Lake View',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { lat: 19.0740, lng: 72.8797 }
        },
        isVerified: true
      },
      {
        name: 'Mohan Caretaker',
        email: 'mohan@example.com',
        phone: '+919876543215',
        password: 'password123',
        role: 'helper',
        address: {
          street: '654 Hill Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { lat: 19.0780, lng: 72.8807 }
        },
        isVerified: true
      },
      {
        name: 'Vijay Backup Plumber',
        email: 'vijay@example.com',
        phone: '+919876543216',
        password: 'password123',
        role: 'helper',
        address: {
          street: '100 Marine Lines',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: { lat: 19.0640, lng: 72.8250 }
        },
        isVerified: true
      },
      {
        name: 'Rahul Emergency Plumber',
        email: 'rahul@example.com',
        phone: '+919876543217',
        password: 'password123',
        role: 'helper',
        address: {
          street: '200 Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          coordinates: { lat: 19.0540, lng: 72.8400 }
        },
        isVerified: true
      }
    ]);

    const helperProfiles = await HelperProfile.create([
      {
        userId: helpers[0]._id,
        serviceType: 'Plumbing',
        skills: ['plumber', 'pipe', 'water', 'leak', 'tap', 'household'],
        trustScore: 85,
        availability: { status: 'available', workingHours: { start: '09:00', end: '18:00' } },
        location: {
          address: '456 Park Road, Mumbai',
          coordinates: { lat: 19.0770, lng: 72.8787 }
        },
        serviceRadius: 10,
        completedTasks: 45,
        isVerified: true
      },
      {
        userId: helpers[1]._id,
        serviceType: 'Electrical',
        skills: ['electrician', 'wire', 'light', 'switch', 'fan', 'household'],
        trustScore: 92,
        availability: { status: 'available', workingHours: { start: '08:00', end: '20:00' } },
        location: {
          address: '789 MG Road, Mumbai',
          coordinates: { lat: 19.0750, lng: 72.8767 }
        },
        serviceRadius: 15,
        completedTasks: 78,
        isVerified: true
      },
      {
        userId: helpers[2]._id,
        serviceType: 'Transport',
        skills: ['driver', 'car', 'vehicle', 'transport'],
        trustScore: 78,
        availability: { status: 'busy', workingHours: { start: '06:00', end: '22:00' } },
        location: {
          address: '321 Lake View, Mumbai',
          coordinates: { lat: 19.0740, lng: 72.8797 }
        },
        serviceRadius: 20,
        completedTasks: 120,
        isVerified: true
      },
      {
        userId: helpers[3]._id,
        serviceType: 'Elderly Care',
        skills: ['caretaker', 'nurse', 'elderly', 'patient', 'medical', 'accompaniment'],
        trustScore: 95,
        availability: { status: 'available', workingHours: { start: '00:00', end: '23:59' } },
        location: {
          address: '654 Hill Road, Mumbai',
          coordinates: { lat: 19.0780, lng: 72.8807 }
        },
        serviceRadius: 8,
        completedTasks: 200,
        isVerified: true
      },
      {
        userId: helpers[4]._id,
        serviceType: 'Plumbing',
        skills: ['plumber', 'pipe', 'water', 'household'],
        trustScore: 70,
        availability: { status: 'available', workingHours: { start: '10:00', end: '17:00' } },
        location: {
          address: '100 Marine Lines, Mumbai',
          coordinates: { lat: 19.0640, lng: 72.8250 }
        },
        serviceRadius: 12,
        completedTasks: 25,
        isVerified: true
      },
      {
        userId: helpers[5]._id,
        serviceType: 'Plumbing',
        skills: ['plumber', 'leak', 'drain', 'household'],
        trustScore: 88,
        availability: { status: 'available', workingHours: { start: '08:00', end: '21:00' } },
        location: {
          address: '200 Bandra West, Mumbai',
          coordinates: { lat: 19.0540, lng: 72.8400 }
        },
        serviceRadius: 15,
        completedTasks: 55,
        isVerified: true
      }
    ]);

    const trustedPeople = await TrustedPerson.create([
      {
        seniorId: senior._id,
        name: 'Rajesh Plumber',
        phone: '+919876543212',
        role: 'Service Provider',
        service: 'Plumbing',
        skills: ['plumber', 'pipe'],
        availability: 'available',
        trustScore: 85,
        userId: helpers[0]._id,
        relationship: 'Trusted Plumber',
        approved: true
      },
      {
        seniorId: senior._id,
        name: 'Amit Electrician',
        phone: '+919876543213',
        role: 'Service Provider',
        service: 'Electrical',
        skills: ['electrician', 'wire'],
        availability: 'available',
        trustScore: 92,
        userId: helpers[1]._id,
        relationship: 'Trusted Electrician',
        approved: true
      },
      {
        seniorId: senior._id,
        name: 'Suresh Driver',
        phone: '+919876543214',
        role: 'Service Provider',
        service: 'Transport',
        skills: ['driver', 'car'],
        availability: 'busy',
        trustScore: 78,
        userId: helpers[2]._id,
        relationship: 'Trusted Driver',
        approved: true
      },
      {
        seniorId: senior._id,
        name: 'Mohan Caretaker',
        phone: '+919876543215',
        role: 'Service Provider',
        service: 'Elderly Care',
        skills: ['caretaker', 'nurse'],
        availability: 'available',
        trustScore: 95,
        userId: helpers[3]._id,
        relationship: 'Trusted Caretaker',
        approved: true
      }
    ]);

    const emergencyServices = await EmergencyService.create([
      {
        name: 'Mumbai Senior Care NGO',
        type: 'ngo',
        organization: 'Mumbai Senior Care Foundation',
        contactPerson: {
          name: 'Mrs. Sharma',
          phone: '+919876550001'
        },
        phone: '+919876550001',
        email: 'help@mumbaiseniorcare.org',
        services: TASK_CATEGORIES.concat(['plumber', 'electrician', 'caretaker', 'all']),
        coverageArea: 'Mumbai City',
        location: {
          address: 'Bandra West, Mumbai',
          coordinates: { lat: 19.0540, lng: 72.8400 }
        },
        serviceRadius: 25,
        availability: { status: 'available', workingHours: { start: '00:00', end: '23:59' } },
        isVerified: true,
        isActive: true,
        rating: { average: 4.8, count: 120 },
        responseTime: '15 minutes',
        description: '24/7 emergency response for senior citizens'
      },
      {
        name: 'Youth Volunteer Network',
        type: 'college-volunteer',
        organization: 'Mumbai University Social Work',
        contactPerson: {
          name: 'Prof. Patel',
          phone: '+919876550002'
        },
        phone: '+919876550002',
        email: 'volunteers@mumuni.edu',
        services: ['transport', 'medicine', 'essentials', 'accompaniment', 'household'],
        coverageArea: 'South Mumbai',
        location: {
          address: 'Fort, Mumbai',
          coordinates: { lat: 18.9400, lng: 72.8300 }
        },
        serviceRadius: 15,
        availability: { status: 'available', workingHours: { start: '08:00', end: '20:00' } },
        isVerified: true,
        isActive: true,
        rating: { average: 4.5, count: 85 },
        responseTime: '30 minutes',
        description: 'College student volunteers for senior assistance'
      },
      {
        name: 'City Emergency Response',
        type: 'government',
        organization: 'Mumbai Municipal Corporation',
        contactPerson: {
          name: 'Emergency Desk',
          phone: '+919876550003'
        },
        phone: '+919876550003',
        email: 'emergency@mcgov.in',
        services: ['medical', 'emergency', 'all'],
        coverageArea: 'Mumbai Metropolitan Region',
        location: {
          address: 'MCGM Headquarters, Mumbai',
          coordinates: { lat: 19.0100, lng: 72.8200 }
        },
        serviceRadius: 50,
        availability: { status: 'available', workingHours: { start: '00:00', end: '23:59' } },
        isVerified: true,
        isActive: true,
        rating: { average: 4.2, count: 500 },
        responseTime: '20 minutes',
        description: 'Government emergency response team'
      },
      {
        name: 'Red Cross Mumbai',
        type: 'ngo',
        organization: 'Indian Red Cross Society',
        contactPerson: {
          name: 'Dr. Reddy',
          phone: '+919876550004'
        },
        phone: '+919876550004',
        email: 'mumbai@redcross.in',
        services: ['medical', 'emergency', 'accompaniment'],
        coverageArea: 'Mumbai City',
        location: {
          address: 'Churchgate, Mumbai',
          coordinates: { lat: 18.9300, lng: 72.8200 }
        },
        serviceRadius: 20,
        availability: { status: 'available', workingHours: { start: '00:00', end: '23:59' } },
        isVerified: true,
        isActive: true,
        rating: { average: 4.9, count: 200 },
        responseTime: '10 minutes',
        description: 'Medical emergency response and accompaniment'
      }
    ]);

    const task = await Task.create({
      seniorId: senior._id,
      category: 'household',
      requiredSkill: 'plumber',
      title: 'Water pump repair',
      description: 'Water pump is not working properly',
      priority: 'normal',
      location: {
        address: '123 Main Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      status: 'created'
    });

    console.log('\n=== Database Seeded Successfully ===\n');
    console.log(`Senior: ${senior.name} (${senior._id})`);
    console.log(`Family: ${family.name} (${family._id})`);
    console.log(`Helpers: ${helpers.map(h => h.name).join(', ')}`);
    console.log(`Task: ${task.title} (${task._id})`);
    console.log('\nTrusted People:', trustedPeople.map(tp => tp.name).join(', '));
    console.log('\nProfessional Helpers:', helperProfiles.slice(4).map(p => p.serviceType).join(', '));
    console.log('\nEmergency Services:', emergencyServices.map(es => es.name).join(', '));

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
