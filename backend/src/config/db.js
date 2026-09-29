import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nothing_web_os';

  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[GLYPH DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`\n======================================================`);
    console.warn(`[GLYPH DB WARNING] Could not connect to MongoDB.`);
    console.warn(`Attempted URI: ${uri}`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`------------------------------------------------------`);
    console.warn(`ACTION REQUIRED:`);
    console.warn(`1. To run locally: Ensure MongoDB service is running (e.g. 'mongod' or MongoDB Compass).`);
    console.warn(`2. To run cloud: Set MONGODB_URI in backend/.env to your MongoDB Atlas connection string.`);
    console.warn(`Note: Telemetry & Weather proxy will still function without DB!`);
    console.warn(`======================================================\n`);
  }
};

mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    console.warn('[GLYPH DB] MongoDB disconnected. Attempting to reconnect...');
  }
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('[GLYPH DB] MongoDB reconnected successfully.');
  isConnected = true;
});

export const getDBStatus = () => isConnected;
