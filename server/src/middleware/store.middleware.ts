import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/models/user.interface';
import { logger } from '../utils/logger.util';

// Validate store creation request
export const validateStoreCreation = (req: Request, res: Response, next: NextFunction) => {
  const { name, address, phone, email } = req.body;

  if (!name || !address || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, address, phone, and email are required',
    });
  }

  // Validate phone number format
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format',
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  next();
};

// Validate store update request
export const validateStoreUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, address, phone, email } = req.body;

  if (phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }
  }

  next();
};

// Check if store exists
export const checkStoreExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    // TODO: Add store model import and check if store exists
    // const store = await StoreModel.findById(storeId);
    // if (!store) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Store not found',
    //   });
    // }

    next();
  } catch (error) {
    logger.error('Error checking store existence:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking store',
    });
  }
};

// Validate store ownership
export const validateStoreOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const storeId = req.params.storeId || req.body.storeId;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    // Admin can access all stores
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Store owner can only access their own store
    if (req.user.role === UserRole.STORE_OWNER && req.user.storeId?.toString() !== storeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this store',
      });
    }

    next();
  } catch (error) {
    logger.error('Error validating store ownership:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating store ownership',
    });
  }
};

// Validate store status
export const validateStoreStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    // TODO: Add store model import and check store status
    // const store = await StoreModel.findById(storeId);
    // if (!store.isActive) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Store is currently inactive',
    //   });
    // }

    next();
  } catch (error) {
    logger.error('Error validating store status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating store status',
    });
  }
};

// Validate store operating hours
export const validateOperatingHours = (req: Request, res: Response, next: NextFunction) => {
  const { operatingHours } = req.body;

  if (!operatingHours) {
    return next();
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  for (const day of days) {
    if (operatingHours[day]) {
      const { open, close } = operatingHours[day];
      
      if (!timeRegex.test(open) || !timeRegex.test(close)) {
        return res.status(400).json({
          success: false,
          message: `Invalid time format for ${day}. Use 24-hour format (HH:mm)`,
        });
      }

      if (open >= close) {
        return res.status(400).json({
          success: false,
          message: `Opening time must be before closing time for ${day}`,
        });
      }
    }
  }

  next();
}; 