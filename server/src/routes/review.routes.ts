import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { reviewValidation } from '../validations/review.validation';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/product/:productId/rating', reviewController.getProductRating);
router.get('/:id', reviewController.getReviewById);

// Protected routes - User
router.post(
  '/',
  authenticate,
  validate(reviewValidation.createReview),
  reviewController.createReview
);

router.put(
  '/:id',
  authenticate,
  validate(reviewValidation.updateReview),
  reviewController.updateReview
);

router.delete(
  '/:id',
  authenticate,
  reviewController.deleteReview
);

router.get(
  '/user',
  authenticate,
  reviewController.getReviewsByUser
);

// Admin routes
router.get(
  '/all',
  authenticate,
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  reviewController.getReviews
);

export default router; 