import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { notificationValidation } from '../validations/notification.validation';

const router = Router();
const notificationController = new NotificationController();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/user', notificationController.getNotificationsByUser);
router.get('/unread-count', notificationController.getUnreadCount);
router.post('/mark-all-read', notificationController.markAllAsRead);

router.get('/:id', notificationController.getNotificationById);
router.put('/:id/mark-read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin routes
router.post(
  '/',
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  validate(notificationValidation.createNotification),
  notificationController.createNotification
);

router.get(
  '/all',
  roleMiddleware([UserRole.ADMIN, UserRole.STORE_OWNER]),
  notificationController.getAllNotifications
);

export default router; 