import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

// Set test environment
process.env.NODE_ENV = 'test';

// Connect to test database
beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket-app-test';
  await mongoose.connect(mongoURI);
});

// Clear database between tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
}); 