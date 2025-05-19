import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.util';

// تتبع الطلبات | Request tracking
export const requestTracker = (req: Request, res: Response, next: NextFunction): void => {
  // إنشاء معرف فريد | Generate unique ID
  const requestId = uuidv4();

  // إضافة المعرف إلى الطلب | Add ID to request
  req.headers['x-request-id'] = requestId;

  // إضافة المعرف إلى الاستجابة | Add ID to response
  res.setHeader('X-Request-ID', requestId);

  // تسجيل بداية الطلب | Log request start
  logger.info('بداية الطلب | Request start:', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // تتبع نهاية الطلب | Track request end
  res.on('finish', () => {
    logger.info('نهاية الطلب | Request end:', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
    });
  });

  next();
};

// تتبع المستخدم | User tracking
export const userTracker = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.user?._id;

  if (userId) {
    logger.info('نشاط المستخدم | User activity:', {
      userId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    });
  }

  next();
};

// تتبع الأداء | Performance tracking
export const performanceTracker = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    logger.info('أداء الطلب | Request performance:', {
      method: req.method,
      url: req.originalUrl,
      duration: `${duration.toFixed(2)}ms`,
      statusCode: res.statusCode,
    });
  });

  next();
};

// تتبع الأخطاء | Error tracking
export const errorTracker = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.headers['x-request-id'];

  logger.error('خطأ في الطلب | Request error:', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  next(err);
};