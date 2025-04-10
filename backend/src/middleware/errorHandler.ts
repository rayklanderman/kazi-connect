import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err).map((val: any) => val.message),
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    res.status(400).json({
      message: 'Duplicate field value entered',
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'Resource not found',
    });
    return;
  }

  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
