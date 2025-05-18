import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validateRequest } from '../middleware/validation.middleware';
import { orderValidation } from '../validations/order.validation';

const router = Router();
const orderController = new OrderController();

// Protected routes - All authenticated users
router.post(
  '/',
  authenticate,
  validateRequest(orderValidation.createOrder),
  (req, res) => orderController.createOrder(req, res)
);

router.get(
  '/my-orders',
  authenticate,
  (req, res) => orderController.getOrdersByUser(req, res)
);

router.get(
  '/:id',
  authenticate,
  (req, res) => orderController.getOrderById(req, res)
);

// Store Owner routes
router.get(
  '/store/:storeId',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  (req, res) => orderController.getOrdersByStore(req, res)
);

router.put(
  '/:id/status',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  validateRequest(orderValidation.updateOrderStatus),
  (req, res) => orderController.updateOrderStatus(req, res)
);

// Add route for assigning delivery employee to an order
router.post(
  '/:id/assign-delivery',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN]),
  validateRequest(orderValidation.assignDeliveryEmployee),
  (req, res) => orderController.assignDeliveryEmployee(req, res)
);

// Admin routes
router.get(
  '/',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  (req, res) => orderController.getOrders(req, res)
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  validateRequest(orderValidation.updateOrder),
  (req, res) => orderController.updateOrder(req, res)
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  (req, res) => orderController.deleteOrder(req, res)
);

// Order tracking routes
router.get(
  '/:id/tracking',
  authenticate,
  (req, res) => orderController.getOrderTracking(req, res)
);

router.put(
  '/:id/tracking',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.ADMIN, UserRole.DELIVERY]),
  validateRequest(orderValidation.updateTracking),
  (req, res) => orderController.updateOrderTracking(req, res)
);

export default router; 