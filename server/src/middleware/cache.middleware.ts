import { Request, Response, NextFunction } from 'express';
import cache from '../config/redis';
import { logger } from '../utils/logger.util';

// تخزين مؤقت للاستجابة | Response caching
export const cacheResponse = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await cache.get(key);

      if (cachedResponse) {
        res.json(JSON.parse(`${cachedResponse}`) );
        return;
      }

      // حفظ الاستجابة الأصلية | Save original response
      const originalJson = res.json;
      res.json = function(body: any): Response {
        cache.set(key, JSON.stringify(body), duration)
          .catch((error) => {
            logger.error('خطأ في تخزين البيانات المؤقتة | Error caching data:', error);
          });

        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('خطأ في التخزين المؤقت | Caching error:', error);
      next();
    }
  };
};

// مسح التخزين المؤقت | Clear cache
export const clearCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const keys = await cache.keys(`cache:${pattern}`);
      
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => cache.del(key)));
        logger.info(`تم مسح التخزين المؤقت لـ ${keys.length} مفتاح | Cleared cache for ${keys.length} keys`);
      }

      next();
    } catch (error) {
      logger.error('خطأ في مسح التخزين المؤقت | Error clearing cache:', error);
      next();
    }
  };
};

// التحقق من التخزين المؤقت | Check cache
export const checkCache = async (key: string): Promise<any> => {
  try {
    const cachedData = await cache.get<string>(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    logger.error('خطأ في التحقق من التخزين المؤقت | Error checking cache:', error);
    return null;
  }
};

// تعيين التخزين المؤقت | Set cache
export const setCache = async (key: string, data: any, duration?: number): Promise<void> => {
  try {
    await cache.set(key, JSON.stringify(data), duration);
  } catch (error) {
    logger.error('خطأ في تعيين التخزين المؤقت | Error setting cache:', error);
  }
}; 