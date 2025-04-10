import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import companyRoutes from './routes/companyRoutes';
import resourceRoutes from './routes/resourceRoutes';

export const createServer = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/resources', resourceRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
};
