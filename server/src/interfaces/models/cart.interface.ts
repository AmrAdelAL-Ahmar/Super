/**
 * Cart related interfaces
 */

/**
 * Cart Item Interface
 * Represents a product in the shopping cart
 */
export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
  name?: string; // Optional as it might be populated from product reference
  addedAt: Date;
}

/**
 * Cart Interface
 * Represents the shopping cart for a user
 */
export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  // Client-calculated values (not stored in DB)
  estimatedTax?: number;
  estimatedShipping?: number;
  total?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cart Summary Interface
 * Provides a quick overview of cart contents
 */
export interface ICartSummary {
  totalItems: number;
  totalAmount: number;
  lastUpdated: Date;
}

/**
 * Add Item Request Interface
 */
export interface IAddItemRequest {
  productId: string;
  quantity: number;
}

/**
 * Update Item Request Interface  
 */
export interface IUpdateItemRequest {
  quantity: number;
} 