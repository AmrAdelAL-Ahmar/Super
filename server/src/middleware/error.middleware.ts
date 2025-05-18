import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

// واجهة الخطأ المخصصة | Custom error interface
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// معالج الأخطاء | Error handler
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
    return;
  }

  // تسجيل الخطأ | Log error
  logger.error('خطأ غير متوقع | Unexpected error:', err);

  // إرسال استجابة الخطأ | Send error response
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'خطأ في الخادم | Server error',
  });
};

// معالج المسارات غير الموجودة | Not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `المسار غير موجود - ${req.originalUrl} | Route not found - ${req.originalUrl}`,
  });
};

// معالج الأخطاء غير المعالجة | Unhandled rejection handler
export const unhandledRejectionHandler = (err: Error): void => {
  logger.error('رفض غير معالج | Unhandled rejection:', err);
  process.exit(1);
};

// معالج الأخطاء غير المعالجة | Uncaught exception handler
export const uncaughtExceptionHandler = (err: Error): void => {
  logger.error('استثناء غير معالج | Uncaught exception:', err);
  process.exit(1);
}; 