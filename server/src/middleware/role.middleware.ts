import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/models/user.interface';
import { AuthRequest } from '../interfaces/auth.interface';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Convenience middleware for specific roles
export const requireAdmin = roleMiddleware([UserRole.ADMIN]);
export const requireStoreOwner = roleMiddleware([UserRole.STORE_OWNER]);
export const requireDelivery = roleMiddleware([UserRole.DELIVERY]);
export const requireCustomer = roleMiddleware([UserRole.CUSTOMER]);

// Middleware for store-specific operations
export const requireStoreAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const storeId = req.params.storeId || req.body.storeId;

  if (!storeId) {
    return res.status(400).json({ message: 'Store ID is required' });
  }

  // Admin can access all stores
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }

  // Store owner can only access their own store
  if (req.user.role === UserRole.STORE_OWNER && req.user.storeId?.toString() !== storeId) {
    return res.status(403).json({ message: 'Access denied to this store' });
  }

  next();
}; 