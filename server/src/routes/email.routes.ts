import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { emailValidation } from '../validations/email.validation';

const router = Router();
const emailController = new EmailController();

// Protected routes - User
router.post(
  '/verification',
  authenticate,
  validate(emailValidation.sendVerificationEmail),
  emailController.sendVerificationEmail
);

router.post(
  '/password-reset',
  authenticate,
  validate(emailValidation.sendPasswordResetEmail),
  emailController.sendPasswordResetEmail
);

router.post(
  '/order-confirmation',
  authenticate,
  validate(emailValidation.sendOrderConfirmationEmail),
  emailController.sendOrderConfirmationEmail
);

router.post(
  '/order-status',
  authenticate,
  validate(emailValidation.sendOrderStatusUpdateEmail),
  emailController.sendOrderStatusUpdateEmail
);

router.post(
  '/welcome',
  authenticate,
  validate(emailValidation.sendWelcomeEmail),
  emailController.sendWelcomeEmail
);

// Protected routes - Admin
router.post(
  '/bulk',
  authenticate,
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  validate(emailValidation.sendBulkEmail),
  emailController.sendBulkEmail
);

export default router; 