import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { productValidation } from '../validations/product.validation';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/store/:storeId', productController.getProductsByStore);
router.get('/search/:searchTerm', productController.searchProducts);
router.get('/:id/reviews', productController.getProductReviews);

// Protected routes - Store Owner
router.post(
  '/',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(productValidation.createProduct),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(productValidation.updateProduct),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  productController.deleteProduct
);

router.put(
  '/:id/status',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  productController.updateProductStatus
);

router.put(
  '/:id/stock',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(productValidation.updateStock),
  productController.updateProductStock
);

router.put(
  '/:id/price',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(productValidation.updatePrice),
  productController.updatePrice
);

router.put(
  '/:id/discount',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(productValidation.updateDiscount),
  productController.updateDiscount
);

export default router; 