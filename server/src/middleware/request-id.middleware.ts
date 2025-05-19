import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// إضافة معرف الطلب | Add request ID
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // إنشاء معرف فريد | Generate unique ID
  const requestId = uuidv4();

  // إضافة المعرف إلى الطلب | Add ID to request
  req.headers['x-request-id'] = requestId;

  // إضافة المعرف إلى الاستجابة | Add ID to response
  res.setHeader('X-Request-ID', requestId);

  next();
};

// الحصول على معرف الطلب | Get request ID
export const getRequestId = (req: Request): string => {
  return req.headers['x-request-id'] as string || 'unknown';
}; 