import cors from 'cors';
import environment from '../config/environment';
import { Request, Response, NextFunction } from 'express';

// تكوين CORS | CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = environment.CORS.ORIGIN;
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('غير مسموح به من CORS | Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// إنشاء وسيط CORS | Create CORS middleware
export const corsMiddleware = cors(corsOptions);

// معالجة أخطاء CORS | CORS error handler
export const corsErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err.message === 'غير مسموح به من CORS | Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'غير مسموح به من CORS | Not allowed by CORS',
    });
    return;
  }
  next(err);
}; 