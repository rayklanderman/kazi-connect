import dotenv from 'dotenv';
import connectDB from './config/database';
import { createServer } from './app';

dotenv.config();

// Connect to MongoDB
connectDB();

const startServer = async () => {
  const app = await createServer();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
