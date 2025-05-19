import compression from 'compression';
import { Request, Response } from 'express';

// تكوين الضغط | Compression configuration
export const compressionMiddleware = compression({
  // تحديد أنواع المحتوى للضغط | Specify content types to compress
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  // مستوى الضغط | Compression level
  level: 6, // Default compression level
  // تحديد الحد الأدنى لحجم الاستجابة للضغط | Minimum response size to compress
  threshold: 1024, // 1KB
  // تحديد أنواع المحتوى للضغط | Content types to compress
  contentType: [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'application/xml',
    'application/x-www-form-urlencoded',
  ],
}); 