import mongoose from "mongoose";
const TEST_DB_URL = "mongodb+srv://sinproject251201:subhan321@cluster0.rngsv.mongodb.net/book-task4";
export const setupTestDB = async () => {
  try {
    await mongoose.connect(TEST_DB_URL);
    console.log("Connected to test database");
  } catch (error) {
    console.error("Error connecting to test database:", error);
    process.exit(1);
  }
};
export const teardownTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};