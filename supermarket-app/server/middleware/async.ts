import type { Request, Response, NextFunction } from 'express';

// Type for Express handler function with any return type
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Wrapper for async functions to eliminate try/catch blocks
const asyncHandler = (fn: ExpressHandler) => 
  (req: Request, res: Response, next: NextFunction): Promise<any> => 
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler; 