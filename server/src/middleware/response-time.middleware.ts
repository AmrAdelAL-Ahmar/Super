import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

// تتبع وقت الاستجابة | Track response time
export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    // تسجيل وقت الاستجابة | Log response time
    logger.info('وقت الاستجابة | Response time:', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
    });

    // إضافة وقت الاستجابة إلى رأس الاستجابة | Add response time to response header
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
  });

  next();
};

// الحصول على وقت الاستجابة | Get response time
export const getResponseTime = (req: Request): number => {
  const start = process.hrtime();
  const [seconds, nanoseconds] = process.hrtime(start);
  return seconds * 1000 + nanoseconds / 1000000;
}; 