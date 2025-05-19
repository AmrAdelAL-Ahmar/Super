import Redis from 'ioredis';
import environment from './environment';
import { logger } from '../utils/logger.util';

// إنشاء عميل Redis | Create Redis client
const redisClient = new Redis({
  host: environment.REDIS.HOST,
  port: environment.REDIS.PORT,
  password: environment.REDIS.PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// معالجة الأحداث | Event handlers
redisClient.on('connect', () => {
  logger.info('تم الاتصال بـ Redis بنجاح | Redis connected successfully');
});

redisClient.on('error', (error) => {
  logger.error('خطأ في الاتصال بـ Redis | Redis connection error:', error);
});

// وظائف التخزين المؤقت | Caching functions
const cache = {
  // تعيين قيمة | Set value
  set: async (key: string, value: any, ttl?: number): Promise<void> => {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await redisClient.setex(key, ttl, stringValue);
      } else {
        await redisClient.set(key, stringValue);
      }
    } catch (error) {
      logger.error('خطأ في تخزين البيانات المؤقتة | Error caching data:', error);
      throw error;
    }
  },

  // الحصول على قيمة | Get value
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('خطأ في استرجاع البيانات المؤقتة | Error retrieving cached data:', error);
      throw error;
    }
  },

  // حذف قيمة | Delete value
  del: async (key: string): Promise<void> => {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error('خطأ في حذف البيانات المؤقتة | Error deleting cached data:', error);
      throw error;
    }
  },

  // مسح جميع القيم | Clear all values
  clear: async (): Promise<void> => {
    try {
      await redisClient.flushall();
    } catch (error) {
      logger.error('خطأ في مسح البيانات المؤقتة | Error clearing cached data:', error);
      throw error;
    }
  },

  // الحصول على المفاتيح | Get keys
  keys: async (pattern: string): Promise<string[]> => {
    try {
      return await redisClient.keys(pattern);
    } catch (error) {
      logger.error('خطأ في الحصول على المفاتيح | Error getting keys:', error);
      throw error;
    }
  },
};

export default cache; 