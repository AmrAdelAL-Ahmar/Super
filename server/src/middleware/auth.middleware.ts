import { NextFunction, Response } from 'express';
import { AuthRequest } from 'src/interfaces/auth.interface';
import { UserRole } from '../interfaces/models/user.interface';
import { jwtService } from '../services/jwt.service';
import { logger } from '../utils/logger.util';

// توسيع واجهة الطلب | Extend request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: UserRole;
        storeId?: string;
      };
    }
  }
}

 

// التحقق من المصادقة | Authentication check
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const user = await jwtService.verifyToken(token);

    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// التحقق من الصلاحيات | Authorization check
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح | Unauthorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'غير مصرح بالوصول | Access forbidden',
      });
      return;
    }

    next();
  };
};

// التحقق من مالك المتجر | Store owner check
export const isStoreOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== UserRole.STORE_OWNER) {
      res.status(403).json({
        success: false,
        message: 'يجب أن تكون مالك متجر | Must be a store owner',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('خطأ في التحقق من مالك المتجر | Store owner check error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم | Server error',
    });
  }
};

// التحقق من موظف التوصيل | Delivery employee check
export const isDeliveryEmployee = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== UserRole.DELIVERY) {
      res.status(403).json({
        success: false,
        message: 'يجب أن تكون موظف توصيل | Must be a delivery employee',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('خطأ في التحقق من موظف التوصيل | Delivery employee check error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم | Server error',
    });
  }
}; 