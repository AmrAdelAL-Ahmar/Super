import dotenv from 'dotenv';
import path from 'path';

// تحميل ملف البيئة | Load environment file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// تكوين البيئة | Environment configuration
const environment = {
  // إعدادات الخادم | Server settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // إعدادات قاعدة البيانات | Database settings
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/supermarket',
  
  // إعدادات JWT | JWT settings
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // إعدادات البريد الإلكتروني | Email settings
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@supermarket.com',
  },
  
  // إعدادات CORS | CORS settings
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || '*',
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  },
  
  // إعدادات التخزين | Storage settings
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  
  // إعدادات Google Maps | Google Maps settings
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  
  // إعدادات Redis | Redis settings
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    PASSWORD: process.env.REDIS_PASSWORD || '',
  },
  
  // إعدادات التخزين المؤقت | Cache settings
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
  
  // إعدادات الأمان | Security settings
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export default environment; 