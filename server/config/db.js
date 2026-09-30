const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_prompt_generator';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });

    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[MongoDB Info] Reason: ${error.message}`);
    console.warn(`[MongoDB Info] Server will run with graceful in-memory storage fallback until MongoDB is available.`);
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB Event] Connection disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[MongoDB Event] Reconnected successfully.');
  });
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
