import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo-test:27017/testdb');
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections)
      .map(collection => collection.deleteMany({}))
  );
});