const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ghar-ka-backup';

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed: ${error.message}. Starting in-memory MongoDB Server fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (innerError) {
      console.error(`Critical: Error starting in-memory MongoDB fallback: ${innerError.message}`);
      process.exit(1);
    }
  }

 try {
  await mongoose.connection.collection('users').dropIndex('familyCode_1');
} catch (err) {
  if (err.code !== 27 && err.codeName !== 'IndexNotFound') {
    console.warn('Could not drop familyCode index:', err.message);
  }
}

try {
  await mongoose.connection.collection('users').createIndex({ familyCode: 1 }, { sparse: true });
  console.log('familyCode index ensured (sparse)');
} catch (err) {
  console.warn('Could not create familyCode index:', err.message);
}
};

module.exports = connectDB;
