import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { storeValidation } from '../validations/store.validation';

const router = Router();
const storeController = new StoreController();

// Public routes
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);
router.get('/:id/products', storeController.getStoreProducts);
router.get('/:id/categories', storeController.getStoreCategories);
router.get('/:id/reviews', storeController.getStoreReviews);

// Protected routes - Store Owner
router.post(
  '/',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.createStore),
  storeController.createStore
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updateStore),
  storeController.updateStore
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  storeController.deleteStore
);

router.put(
  '/:id/status',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  validate(storeValidation.updateStoreStatus),
  storeController.updateStoreStatus
);

router.put(
  '/:id/hours',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updateStoreHours),
  storeController.updateStoreHours
);

router.put(
  '/:id/location',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updateStoreLocation),
  storeController.updateStoreLocation
);

// Admin routes
router.get(
  '/admin/all',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  storeController.getAllStores
);

router.put(
  '/:id/verify',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  validate(storeValidation.verifyStore),
  storeController.verifyStore
);

// Store settings routes
router.put(
  '/:id/business-hours',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updateBusinessHours),
  storeController.updateBusinessHours
);

router.put(
  '/:id/delivery-settings',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updateDeliverySettings),
  storeController.updateDeliverySettings
);

router.put(
  '/:id/payment-methods',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(storeValidation.updatePaymentMethods),
  storeController.updatePaymentMethods
);

export default router; 