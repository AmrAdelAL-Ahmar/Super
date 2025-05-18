import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { userValidation } from '../validations/user.validation';

const router = Router();
const userController = new UserController();

// Note: Authentication-related routes like registration, login, 
// password reset, and verification are handled by AuthController in auth.routes.ts

// Protected routes - User profile
router.get(
  '/profile',
  authenticate,
  (req, res) => {
    // Using the getUserById method with the current user's ID
    if (req.user?._id) {
      userController.getUserById(
        { ...req, params: { id: req.user._id.toString() } } as any, 
        res
      );
    } else {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
  }
);

router.put(
  '/profile',
  authenticate,
  validate(userValidation.updateUser), // Using existing validation
  (req, res) => {
    // Using the updateUser method with the current user's ID
    if (req.user?._id) {
      userController.updateUser(
        { ...req, params: { id: req.user._id.toString() } } as any, 
        res
      );
    } else {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
  }
);

// Admin routes
router.get(
  '/',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.getUsers
);
router.post(
  '/',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.createUser
);

router.get(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.getUserById
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  validate(userValidation.updateUser),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.deleteUser
);

// Additional admin user management routes
router.put(
  '/:id/status',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.updateUserStatus
);

router.put(
  '/:id/role',
  authenticate,
  roleMiddleware([UserRole.ADMIN]),
  userController.updateUserRole
);

export default router; 