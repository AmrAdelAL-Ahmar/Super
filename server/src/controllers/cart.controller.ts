import { Response } from 'express';
import { CartService } from '../services/cart.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { sendSuccess, sendError } from '../utils/response.util';
import { IAddItemRequest } from '../interfaces/models/cart.interface';

/**
 * Cart Controller
 * Handles all cart-related HTTP requests
 */
export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /**
   * Authenticate request and verify user ID
   * @returns User ID or null if authentication fails
   */
  private authenticateUser(req: AuthRequest, res: Response): string | null {
    if (!req.user?._id) {
      sendError(res, 'User not authenticated', 401);
      return null;
    }
    return req.user._id;
  }

  /**
   * Create a new cart for the user
   */
  createCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const cart = await this.cartService.createCart(userId);
      sendSuccess(res, cart, 'Cart created successfully', 201);
    } catch (error) {
      logger.error('Create cart error:', error);
      sendError(res, 'Error creating cart');
    }
  };

  /**
   * Get user's cart details
   */
  getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const cart = await this.cartService.getCartByUserId(userId);
      sendSuccess(res, cart);
    } catch (error) {
      logger.error('Get cart error:', error);
      sendError(res, 'Error retrieving cart');
    }
  };

  /**
   * Add an item to the cart
   */
  addItemToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const { productId, quantity } = req.body as IAddItemRequest;
      const cart = await this.cartService.addItemToCart(userId, productId, quantity);
      
      sendSuccess(res, cart, 'Item added to cart');
    } catch (error) {
      logger.error('Add item to cart error:', error);
      sendError(res, 'Error adding item to cart');
    }
  };

  /**
   * Update item quantity in cart
   */
  updateItemQuantity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const productId = req.params.itemId;
      const { quantity } = req.body;
      
      if (!productId) {
        sendError(res, 'Product ID is required', 400);
        return;
      }

      const cart = await this.cartService.updateItemQuantity(userId, productId, quantity);
      sendSuccess(res, cart, 'Item quantity updated');
    } catch (error) {
      logger.error('Update item quantity error:', error);
      sendError(res, 'Error updating item quantity');
    }
  };

  /**
   * Remove an item from the cart
   */
  removeItemFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const productId = req.params.itemId;
      
      if (!productId) {
        sendError(res, 'Product ID is required', 400);
        return;
      }
      
      const cart = await this.cartService.removeItemFromCart(userId, productId);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      logger.error('Remove item from cart error:', error);
      sendError(res, 'Error removing item from cart');
    }
  };

  /**
   * Clear all items from the cart
   */
  clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const cart = await this.cartService.clearCart(userId);
      sendSuccess(res, cart, 'Cart cleared successfully');
    } catch (error) {
      logger.error('Clear cart error:', error);
      sendError(res, 'Error clearing cart');
    }
  };

  /**
   * Get cart item count
   */
  getCartItemCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const count = await this.cartService.getCartItemCount(userId);
      sendSuccess(res, { count });
    } catch (error) {
      logger.error('Get cart item count error:', error);
      sendError(res, 'Error getting cart item count');
    }
  };

  /**
   * Apply coupon to cart
   * (Placeholder for future implementation)
   */
  applyCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;

      const { code } = req.body;
      
      // TODO: Implement coupon application logic with code
      logger.info(`Attempting to apply coupon code: ${code}`);
      sendError(res, 'Apply coupon functionality not implemented yet', 501);
    } catch (error) {
      logger.error('Apply coupon error:', error);
      sendError(res, 'Error applying coupon');
    }
  };

  /**
   * Remove coupon from cart
   * (Placeholder for future implementation)
   */
  removeCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;
      
      // TODO: Implement coupon removal logic
      sendError(res, 'Remove coupon functionality not implemented yet', 501);
    } catch (error) {
      logger.error('Remove coupon error:', error);
      sendError(res, 'Error removing coupon');
    }
  };

  /**
   * Checkout cart
   * (Placeholder for future implementation)
   */
  checkout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = this.authenticateUser(req, res);
      if (!userId) return;
      
      // Store checkout parameters for future implementation
      const checkoutData = req.body;
      logger.info(`Checkout requested for user ${userId} with data:`, checkoutData);
      
      // TODO: Implement checkout logic
      sendError(res, 'Checkout functionality not implemented yet', 501);
    } catch (error) {
      logger.error('Checkout error:', error);
      sendError(res, 'Error processing checkout');
    }
  };
} 