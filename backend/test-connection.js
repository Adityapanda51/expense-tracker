import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI);
console.log('\nAttempting to connect...\n');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ Connection successful!');
    console.log('Connected to:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Connection failed!');
    console.log('Error:', err.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Ensure the cluster exists and is running');
    console.log('4. Check network connectivity');
    process.exit(1);
  });
