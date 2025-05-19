import { Types } from 'mongoose';
import { ICart } from '../interfaces/models/cart.interface';
import CartModel from '../models/cart.model';
import ProductModel from '../models/product.model';
import { logger } from '../utils/logger.util';

export class CartService {
  async createCart(userId: string): Promise<ICart> {
    try {
      const existingCart = await CartModel.findOne({ userId });
      if (existingCart) {
        return existingCart.toObject() as ICart;
      }

      const cart = await CartModel.create({
        userId,
        items: [],
        total: 0
      });

      return cart.toObject() as ICart;
    } catch (error) {
      logger.error('Create cart error:', error);
      throw error;
    }
  }

  async getCartByUserId(userId: string): Promise<ICart | null> {
    try {
      return await CartModel.findOne({ userId })
        .populate('items.productId', 'name price images stock');
    } catch (error) {
      logger.error('Get cart error:', error);
      throw error;
    }
  }

  async addItemToCart(userId: string, productId: string, quantity: number): Promise<ICart | null> {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stockQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId: new Types.ObjectId(productId), quantity, price: product.price, totalPrice: product.price * quantity, addedAt: new Date() });
      }

      await this.updateCartTotal(cart.toObject() as ICart);
      return (await cart.save()).toObject() as ICart;
    } catch (error) {
      logger.error('Add item to cart error:', error);
      throw error;
    }
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<ICart | null> {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stockQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      const item = cart.items.find(item => item.productId.toString() === productId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      item.quantity = quantity;
      await this.updateCartTotal(cart.toObject() as ICart);
     return (await cart.save()).toObject() as ICart;
    } catch (error) {
      logger.error('Update item quantity error:', error);
      throw error;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<ICart | null> {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await this.updateCartTotal(cart.toObject() as ICart);
      return (await cart.save()).toObject() as ICart;
    } catch (error) {
      logger.error('Remove item from cart error:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<ICart | null> {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.items = [];
      cart.total = 0;
      return (await cart.save()).toObject() as ICart;
    } catch (error) {
      logger.error('Clear cart error:', error);
      throw error;
    }
  }

  private async updateCartTotal(cart: ICart): Promise<void> {
    try {
      let total = 0;
      for (const item of cart.items) {
        const product = await ProductModel.findById(item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }
      cart.total = total;
    } catch (error) {
      logger.error('Update cart total error:', error);
      throw error;
    }
  }

  async getCartItemCount(userId: string): Promise<number> {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        return 0;
      }
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      logger.error('Get cart item count error:', error);
      throw error;
    }
  }
} 