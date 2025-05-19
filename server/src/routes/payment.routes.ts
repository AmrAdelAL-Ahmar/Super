import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { paymentValidation } from '../validations/payment.validation';

const router = Router();
const paymentController = new PaymentController();

// All routes require authentication
router.use(authenticate);

// User routes
router.post(
  '/',
  validate(paymentValidation.createPayment),
  paymentController.createPayment
);

router.get('/user', paymentController.getPaymentsByUser);
router.get('/:id', paymentController.getPaymentById);
router.get('/order/:orderId', paymentController.getPaymentsByOrder);

router.post(
  '/process',
  validate(paymentValidation.processPayment),
  paymentController.processPayment
);

router.post(
  '/confirm',
  validate(paymentValidation.confirmPayment),
  paymentController.confirmPayment
);

router.post(
  '/method',
  validate(paymentValidation.addPaymentMethod),
  paymentController.addPaymentMethod
);

router.delete(
  '/method/:methodId',
  paymentController.removePaymentMethod
);

// Admin/Store Owner routes
router.put(
  '/:id/status',
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  validate(paymentValidation.updatePaymentStatus),
  paymentController.updatePaymentStatus
);

router.post(
  '/:id/refund',
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  validate(paymentValidation.refundPayment),
  paymentController.refundPayment
);

router.get(
  '/transactions/all',
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  paymentController.getAllTransactions
);

export default router; 