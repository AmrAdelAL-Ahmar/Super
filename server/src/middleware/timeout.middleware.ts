import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger.util';

// تكوين مهلة الطلب | Request timeout configuration
let requestTimeout = 30000; // 30 seconds

// معالجة مهلة الطلب | Handle request timeout
export const timeoutMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // تعيين مؤقت | Set timer
  const timeout = setTimeout(() => {
    logger.warn('انتهت مهلة الطلب | Request timeout:', {
      method: req.method,
      url: req.originalUrl,
      timeout: `${requestTimeout / 1000}s`,
    });

    next(new AppError('انتهت مهلة الطلب | Request timeout', 408));
  }, requestTimeout);

  // إضافة المؤقت إلى الطلب | Add timer to request
  req.setTimeout(requestTimeout);

  // إزالة المؤقت عند اكتمال الطلب | Remove timer on request completion
  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
};

// تعيين مهلة الطلب | Set request timeout
export const setRequestTimeout = (timeout: number): void => {
  if (timeout < 0) {
    throw new Error('يجب أن تكون المهلة أكبر من صفر | Timeout must be greater than zero');
  }
  requestTimeout = timeout;
};

// الحصول على مهلة الطلب | Get request timeout
export const getRequestTimeout = (): number => {
  return requestTimeout;
}; 