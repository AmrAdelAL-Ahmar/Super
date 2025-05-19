import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { UserRole } from '../interfaces/models/user.interface';
import { validate } from '../middleware/validation.middleware';
import { employeeValidation } from '../validations/employee.validation';

const router = Router();
const employeeController = new EmployeeController();

// Public routes
router.get('/:id', employeeController.getEmployeeById);

// Protected routes - Store Owner
router.post(
  '/',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(employeeValidation.createEmployee),
  employeeController.createEmployee
);

router.put(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(employeeValidation.updateEmployee),
  employeeController.updateEmployee
);

router.delete(
  '/:id',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  employeeController.deleteEmployee
);

router.get(
  '/store',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  employeeController.getEmployeesByStore
);

router.get(
  '/stats',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  employeeController.getEmployeeStats
);

// Protected routes - Employee
router.put(
  '/location',
  authenticate,
  roleMiddleware([UserRole.EMPLOYEE]),
  validate(employeeValidation.updateLocation),
  employeeController.updateLocation
);

router.put(
  '/availability',
  authenticate,
  roleMiddleware([UserRole.EMPLOYEE]),
  validate(employeeValidation.updateAvailability),
  employeeController.updateAvailability
);

// Schedule management
router.get(
  '/:id/schedule',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER, UserRole.EMPLOYEE]),
  employeeController.getEmployeeSchedule
);

router.put(
  '/:id/schedule',
  authenticate,
  roleMiddleware([UserRole.STORE_OWNER]),
  validate(employeeValidation.updateSchedule),
  employeeController.updateEmployeeSchedule
);

export default router; 