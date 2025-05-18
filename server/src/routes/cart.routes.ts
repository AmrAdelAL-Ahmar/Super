import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { cartValidation } from '../validations/cart.validation';

/**
 * Cart routes
 * Handles all cart-related endpoints
 */
const router = Router();
const cartController = new CartController();

// All routes require authentication
router.use(authenticate);

// Cart management
router.get('/', cartController.getCart);
router.get('/create', cartController.createCart);
router.get('/count', cartController.getCartItemCount);

router.post(
  '/add-item',
  validateRequest(cartValidation.addItem),
  cartController.addItemToCart
);

router.put(
  '/update-item/:itemId',
  validateRequest(cartValidation.updateItem),
  cartController.updateItemQuantity
);

router.delete(
  '/remove-item/:itemId',
  cartController.removeItemFromCart
);

router.delete(
  '/clear',
  cartController.clearCart
);

// Additional cart operations - these need to be implemented
// router.post(
//   '/apply-coupon',
//   validateRequest(cartValidation.applyCoupon),
//   (req: AuthRequest, res: Response) => {
//     // This method needs to be implemented in CartController
//     res.status(501).json({
//       success: false,
//       message: 'Apply coupon functionality not implemented yet'
//     });
//   }
// );

// router.delete(
//   '/remove-coupon',
//   (req: AuthRequest, res: Response) => {
//     // This method needs to be implemented in CartController
//     res.status(501).json({
//       success: false,
//       message: 'Remove coupon functionality not implemented yet'
//     });
//   }
// );

// router.post(
//   '/checkout',
//   validateRequest(cartValidation.checkout),
//   (req: AuthRequest, res: Response) => {
//     // This method needs to be implemented in CartController
//     res.status(501).json({
//       success: false,
//       message: 'Checkout functionality not implemented yet'
//     });
//   }
// );

export default router; 