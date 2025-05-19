import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema
} from '../validations/auth.validation';
import { requestSizeMiddleware } from '../middleware/request-size.middleware';
import { timeoutMiddleware } from '../middleware/timeout.middleware';

const router = Router();
const authController = new AuthController();

// Apply global middleware
router.use(requestSizeMiddleware);
router.use(timeoutMiddleware);

// Public routes
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.resendVerification
);

// Protected routes
router.post(
  '/logout',
  authController.logout
);

router.post(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword
);

export default router; 