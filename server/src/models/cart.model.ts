import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICart, ICartItem, ICartSummary } from '../interfaces/models/cart.interface';

/**
 * Cart Item Document Interface
 */
interface ICartItemDocument {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: Date;
}

/**
 * Cart Document Interface with Mongoose-specific types
 */
export interface ICartDocument extends Omit<ICart, '_id' | 'userId' | 'items'>, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItemDocument[];
  
  // Methods
  addItem(productId: string, quantity: number, price: number): Promise<void>;
  removeItem(productId: string): Promise<void>;
  updateItemQuantity(productId: string, quantity: number): Promise<void>;
  clearCart(): Promise<void>;
  updateSubtotal(): Promise<void>;
  
  // Virtuals
  cartSummary: ICartSummary;
}

/**
 * Cart Item Schema
 */
const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Cart Schema
 */
const cartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual for cart summary
 */
cartSchema.virtual('cartSummary').get(function(this: ICartDocument): ICartSummary {
  return {
    totalItems: this.items.length,
    totalAmount: this.subtotal,
    lastUpdated: this.updatedAt,
  };
});

/**
 * Method to add item to cart
 */
cartSchema.methods.addItem = async function(
  productId: string,
  quantity: number,
  price: number
): Promise<void> {
  const existingItem = this.items.find(
    (item: ICartItemDocument) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.quantity * existingItem.price;
  } else {
    this.items.push({
      productId: new Types.ObjectId(productId),
      quantity,
      price,
      totalPrice: quantity * price,
      addedAt: new Date(),
    });
  }

  await this.updateSubtotal();
  await this.save();
};

/**
 * Method to remove item from cart
 */
cartSchema.methods.removeItem = async function(productId: string): Promise<void> {
  this.items = this.items.filter(
    (item: ICartItemDocument) => item.productId.toString() !== productId
  );
  await this.updateSubtotal();
  await this.save();
};

/**
 * Method to update item quantity
 */
cartSchema.methods.updateItemQuantity = async function(
  productId: string,
  quantity: number
): Promise<void> {
  const item = this.items.find(
    (item: ICartItemDocument) => item.productId.toString() === productId
  );

  if (item) {
    item.quantity = quantity;
    item.totalPrice = item.quantity * item.price;
    await this.updateSubtotal();
    await this.save();
  }
};

/**
 * Method to clear cart
 */
cartSchema.methods.clearCart = async function(): Promise<void> {
  this.items = [];
  this.subtotal = 0;
  await this.save();
};

/**
 * Method to update subtotal
 */
cartSchema.methods.updateSubtotal = async function(): Promise<void> {
  this.subtotal = this.items.reduce(
    (total: number, item: ICartItemDocument) => total + item.totalPrice,
    0
  );
};

// Create index on userId for faster queries
cartSchema.index({ userId: 1 });

const CartModel = mongoose.model<ICartDocument>('Cart', cartSchema);

export default CartModel; 