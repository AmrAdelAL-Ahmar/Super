import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

// تسجيل الطلبات | Request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};

// تسجيل الأخطاء | Error logging
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('خطأ في الطلب | Request error:', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    error: err.message,
    stack: err.stack,
  });

  next(err);
};

// تسجيل الأداء | Performance logging
export const performanceLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    if (duration > 1000) { // أكثر من ثانية | More than 1 second
      logger.warn('طلب بطيء | Slow request:', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration.toFixed(2)}ms`,
      });
    }
  });

  next();
};

// تسجيل البيانات الحساسة | Sensitive data logging
export const sensitiveDataLogger = (req: Request, res: Response, next: NextFunction): void => {
  const sensitiveFields = ['password', 'token', 'creditCard', 'ssn'];

  const sanitizeData = (data: any): any => {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitizedData: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (sensitiveFields.includes(key)) {
        sanitizedData[key] = '***';
      } else if (typeof value === 'object' && value !== null) {
        sanitizedData[key] = sanitizeData(value);
      } else {
        sanitizedData[key] = value;
      }
    }

    return sanitizedData;
  };

  logger.info('طلب جديد | New request:', {
    method: req.method,
    url: req.originalUrl,
    body: sanitizeData(req.body),
    params: sanitizeData(req.params),
    query: sanitizeData(req.query),
  });

  next();
}; 