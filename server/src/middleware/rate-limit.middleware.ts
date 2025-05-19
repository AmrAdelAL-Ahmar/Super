import rateLimit from 'express-rate-limit';
import { AppError } from './error.middleware';
import environment from '../config/environment';

// حد معدل الطلبات العامة | General rate limiter
export const generalLimiter = rateLimit({
  windowMs: environment.RATE_LIMIT.WINDOW_MS,
  max: environment.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى للطلبات | Too many requests',
  },
  handler: (req, res) => {
    throw new AppError('تم تجاوز الحد الأقصى للطلبات | Too many requests', 429);
  },
});

// حد معدل طلبات تسجيل الدخول | Login rate limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول | Too many login attempts',
  },
  handler: (req, res) => {
    throw new AppError('تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول | Too many login attempts', 429);
  },
});

// حد معدل طلبات إنشاء الحساب | Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات إنشاء الحساب | Too many registration attempts',
  },
  handler: (req, res) => {
    throw new AppError('تم تجاوز الحد الأقصى لمحاولات إنشاء الحساب | Too many registration attempts', 429);
  },
});

// حد معدل طلبات إعادة تعيين كلمة المرور | Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات إعادة تعيين كلمة المرور | Too many password reset attempts',
  },
  handler: (req, res) => {
    throw new AppError('تم تجاوز الحد الأقصى لمحاولات إعادة تعيين كلمة المرور | Too many password reset attempts', 429);
  },
}); 