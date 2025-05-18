import { Router } from 'express';
import { MapsController } from '../controllers/maps.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { mapsValidation } from '../validations/maps.validation';

const router = Router();
const mapsController = new MapsController();

// Public routes
router.get(
  '/nearby-stores',
    validate(mapsValidation.getNearbyStores),
  mapsController.getNearbyStores
);

router.get(
  '/store/:storeId/location',
  mapsController.getStoreLocation
);

// Protected routes
router.get(
  '/delivery-estimate',
  authenticate,
  validate(mapsValidation.getDeliveryEstimate),
  mapsController.getDeliveryEstimate
);

router.get(
  '/route-optimization',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(mapsValidation.getRouteOptimization),
  mapsController.getRouteOptimization
);

router.put(
  '/store/:storeId/location',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(mapsValidation.updateStoreLocation),
  mapsController.updateStoreLocation
);

export default router; 