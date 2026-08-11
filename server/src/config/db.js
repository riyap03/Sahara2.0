const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ghar-ka-backup';

    // Attempt standard connection
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000 // fail fast if local mongod is not running
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
};

module.exports = connectDB;
