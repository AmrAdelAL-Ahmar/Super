import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger.util';

// تكوين حجم الطلب | Request size configuration
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

// التحقق من حجم الطلب | Check request size
export const requestSizeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  if (contentLength > MAX_REQUEST_SIZE) {
    logger.warn('حجم الطلب كبير جدًا | Request size too large:', {
      method: req.method,
      url: req.originalUrl,
      size: `${(contentLength / 1024 / 1024).toFixed(2)}MB`,
    });

    next(new AppError('حجم الطلب كبير جدًا | Request size too large', 413));
    return;
  }

  next();
};

// الحصول على حجم الطلب | Get request size
export const getRequestSize = (req: Request): number => {
  return parseInt(req.headers['content-length'] || '0', 10);
};

// التحقق من حجم الطلب | Check request size
export const checkRequestSize = (req: Request): boolean => {
  const size = getRequestSize(req);
  return size <= MAX_REQUEST_SIZE;
}; 