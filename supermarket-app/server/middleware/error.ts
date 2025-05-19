import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

interface MongooseError extends Error {
  code?: number;
  keyValue?: any;
  errors?: any;
  kind?: string;
  value?: any;
  path?: string;
}

const errorHandler = (
  err: any,
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if ((err as MongooseError).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors as any).map((val: any) => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

export default errorHandler; 