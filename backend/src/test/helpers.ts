import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/User';

export const createTestUser = async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'test-jwt-secret',
    { expiresIn: '30d' }
  );

  return { user, token };
};

export const generateObjectId = () => new Types.ObjectId().toString();
