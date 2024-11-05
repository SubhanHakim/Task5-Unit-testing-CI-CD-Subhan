import databaseConfig from './config/database';
import app from './app';
import mongoose from 'mongoose';
import { createServer, Server } from 'http';

// connect database
mongoose
  .connect(databaseConfig.url)
  .then(() => {
    console.log("Database berhasil terhubung");
  })
  .catch((err: Error) => {
    console.log("Gagal terhubung ke database:", err.message);
  });

const PORT: number = 3000;
const server: Server = createServer(app);
server.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));