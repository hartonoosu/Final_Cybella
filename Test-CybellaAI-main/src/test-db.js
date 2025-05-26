import { connectDB } from './lib/db.js';
import User from './models/User.js';

// Test Database Connection and User Model
const testDB = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create a test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'testpassword123',
    });

    // Save the user to the database
    await testUser.save();

    console.log('User Created:', testUser);
    process.exit(0);
  } catch (error) {
    console.error('Database Test Error:', error);
    process.exit(1);
  }
};

// Run the test
testDB();
