import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/users';

import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Routes for addresses - accessible by all authenticated users
router.route('/addresses')
  .post(addAddress);

router.route('/addresses/:id')
  .put(updateAddress)
  .delete(deleteAddress);

// Routes for user management - accessible only by owner
router.use(authorize('owner'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router; 