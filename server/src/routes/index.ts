import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import storeRoutes from './store.routes';
import orderRoutes from './order.routes';
import cartRoutes from './cart.routes';
import paymentRoutes from './payment.routes';
import reviewRoutes from './review.routes';
import addressRoutes from './address.routes';
import notificationRoutes from './notification.routes';
import employeeRoutes from './employee.routes';
import emailRoutes from './email.routes';
import mapsRoutes from './maps.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/stores', storeRoutes);
router.use('/orders', orderRoutes);
router.use('/carts', cartRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/addresses', addressRoutes);
router.use('/notifications', notificationRoutes);
router.use('/employees', employeeRoutes);
router.use('/emails', emailRoutes);
router.use('/maps', mapsRoutes);

export default router; 