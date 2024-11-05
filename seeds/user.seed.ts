import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/auth.models';
import databaseConfig from '../config/database';

async function seedUser(): Promise<void> {
  try {
    // Pastikan URL database tersedia
    const dbUrl = process.env.MONGODB_URL || databaseConfig.url;
    
    // Connect ke database
    await mongoose.connect(dbUrl);
    console.log('Connected to database');

    // Hapus user yang ada terlebih dahulu
    await User.deleteMany({ name: "subhan" });
    console.log('Existing user deleted');

    // Buat credentials
    const password = "subhan321";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser: IUser = await User.create({
      name: "subhan",
      password: hashedPassword
    });

    console.log("User created successfully:", newUser.name);

  } catch (error) {
    console.error("Error seeding data:", 
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw error; // Re-throw error untuk ditangkap oleh catch di bawah
  } finally {
    // Tutup koneksi database
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.disconnect();
      console.log("Database connection closed");
    }
  }
}

seedUser();
