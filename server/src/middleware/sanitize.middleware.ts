import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

// تنظيف البيانات | Data sanitization
export const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitizedData: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // إزالة الأحرف الخاصة | Remove special characters
      sanitizedData[key] = value.replace(/[<>]/g, '');
    } else if (typeof value === 'object' && value !== null) {
      // تنظيف الكائنات المتداخلة | Sanitize nested objects
      sanitizedData[key] = sanitizeData(value);
    } else {
      sanitizedData[key] = value;
    }
  }

  return sanitizedData;
};

// تنظيف الطلب | Request sanitization
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // تنظيف البيانات | Sanitize body
    if (req.body) {
      req.body = sanitizeData(req.body);
    }

    // تنظيف المعلمات | Sanitize params
    if (req.params) {
      req.params = sanitizeData(req.params);
    }

    // تنظيف الاستعلام | Sanitize query
    if (req.query) {
      req.query = sanitizeData(req.query);
    }

    next();
  } catch (error) {
    next(new AppError('خطأ في تنظيف البيانات | Data sanitization error', 400));
  }
};

// تنظيف البيانات | Data sanitization
export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.body) {
      req.body = sanitizeData(req.body);
    }
    next();
  } catch (error) {
    next(new AppError('خطأ في تنظيف البيانات | Data sanitization error', 400));
  }
};

// تنظيف المعلمات | Parameters sanitization
export const sanitizeParams = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.params) {
      req.params = sanitizeData(req.params);
    }
    next();
  } catch (error) {
    next(new AppError('خطأ في تنظيف المعلمات | Parameters sanitization error', 400));
  }
};

// تنظيف الاستعلام | Query sanitization
export const sanitizeQuery = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (req.query) {
      req.query = sanitizeData(req.query);
    }
    next();
  } catch (error) {
    next(new AppError('خطأ في تنظيف الاستعلام | Query sanitization error', 400));
  }
}; 