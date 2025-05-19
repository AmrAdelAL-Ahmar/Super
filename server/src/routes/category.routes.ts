import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { categoryValidation } from '../validations/category.validation';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getCategoryProducts);

// Protected routes - Store Owner
router.post(
  '/',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(categoryValidation.updateCategory),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  categoryController.deleteCategory
);

// Category operations
router.put(
  '/:id/reorder',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  validate(categoryValidation.reorderCategories),
  categoryController.reorderCategories
);

router.put(
  '/:id/visibility',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(categoryValidation.updateVisibility),
  categoryController.updateVisibility
);

export default router; 