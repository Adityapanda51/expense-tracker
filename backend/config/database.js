import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  // In serverless environments, avoid throwing during cold start.
  // Let API handlers return 500/JSON instead of dropping the connection.
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('✗ MONGODB_URI is not set');
      return null;
    }

    const conn = await mongoose.connect(uri, {
      // Mongoose v7+ supports these without legacy options
      autoIndex: false,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error connecting MongoDB: ${error.message}`);
    return null;
  }
};

export default connectDB;

