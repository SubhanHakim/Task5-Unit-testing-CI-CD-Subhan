import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo-test:27017/testdb');
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  // Perbaiki error iterator dengan menggunakan toArray()
  const collections = mongoose.connection.collections;
  
  // Iterate over collections object
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});