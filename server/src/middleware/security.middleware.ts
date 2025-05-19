import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import environment from '../config/environment';

// تكوين Helmet | Helmet configuration
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// تكوين XSS | XSS configuration
export const xssMiddleware = xss();

// تكوين HPP | HPP configuration
export const hppMiddleware = hpp();

// تكوين Mongo Sanitize | Mongo Sanitize configuration
export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
});

// تكوين حد معدل الطلبات | Rate limit configuration
export const securityRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى للطلبات | Too many requests',
  },
});

// تكوين حد معدل تسجيل الدخول | Login rate limit configuration
export const loginRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login attempts per hour
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول | Too many login attempts',
  },
});

// تكوين حد معدل إنشاء الحساب | Registration rate limit configuration
export const registerRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // limit each IP to 3 registration attempts per day
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات إنشاء الحساب | Too many registration attempts',
  },
});  