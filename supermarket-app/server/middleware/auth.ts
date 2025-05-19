import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from './async';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  role: string;
}

// Extended Express Request with user object
export interface UserRequest extends Request {
  user?: any;
}

// Protect routes middleware
export const protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    // Get token from authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      // Set token from cookie
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as JwtPayload;

      // Attach user to request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return next(new ErrorResponse('User not found', 404));
      }

      next();
    } catch (err) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }
);

// Authorize by role middleware
export const authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user?.role || 'unknown'} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
}; 