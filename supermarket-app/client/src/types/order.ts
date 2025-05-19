/**
 * Order status enum representing the different states an order can be in
 */
export type OrderStatus = 
  | 'pending'      // Initial state when order is placed
  | 'confirmed'    // Order is confirmed but not yet being prepared
  | 'processing'   // Order is being prepared
  | 'outForDelivery' // Order is out for delivery
  | 'delivered'    // Order has been delivered
  | 'cancelled';   // Order has been cancelled

/**
 * Product item in an order
 */
export interface OrderItem {
  /** Product ID */
  id: string;
  /** English product name */
  name: string;
  /** Arabic product name */
  nameAr: string;
  /** Quantity ordered */
  quantity: number;
  /** Unit price at time of order */
  price: number;
  /** Product image URL */
  image?: string;
}

/**
 * Shipping address for an order
 */
export interface ShippingAddress {
  /** Address nickname (e.g., "Home", "Work") */
  name: string;
  /** Arabic address nickname */
  nameAr: string;
  /** Recipient's full name */
  recipient: string;
  /** Street address */
  street: string;
  /** City */
  city: string;
  /** State/province */
  state: string;
  /** Postal/ZIP code */
  zipCode: string;
  /** Contact phone number */
  phone: string;
}

/**
 * Payment methods supported
 */
export type PaymentMethod = 'cash' | 'card' | 'online';

/**
 * Order status change event for tracking history
 */
export interface TimelineEvent {
  /** Order status at this event */
  status: OrderStatus;
  /** ISO timestamp when the status changed */
  date: string;
  /** Optional notes about this status change */
  notes?: string;
}

/**
 * Order summary details for list views
 */
export interface OrderSummary {
  /** Order ID */
  id: string;
  /** Date order was placed (ISO format) */
  date: string;
  /** Current order status */
  status: OrderStatus;
  /** Total order amount */
  total: number;
  /** Number of items in the order */
  itemsCount: number;
}

/**
 * Complete order information
 */
export interface Order {
  /** Order ID */
  id: string;
  /** Date order was placed (ISO format) */
  date: string;
  /** Current order status */
  status: OrderStatus;
  /** Total order amount */
  total: number;
  /** Items in the order */
  items: OrderItem[];
  /** Order subtotal (before shipping and discounts) */
  subtotal: number;
  /** Shipping cost */
  shippingCost: number;
  /** Discount amount */
  discount: number;
  /** Payment method used */
  paymentMethod: PaymentMethod;
  /** Shipping address */
  shippingAddress: ShippingAddress;
  /** Order status history */
  timeline: TimelineEvent[];
}

/**
 * Order filter criteria
 */
export interface OrderFilter {
  /** Optional filter by status */
  status?: OrderStatus;
  /** Optional search term for order ID */
  searchTerm?: string;
  /** Optional date range start */
  dateFrom?: string;
  /** Optional date range end */
  dateTo?: string;
  /** Sort field (e.g., "date", "total") */
  sortBy?: string;
  /** Sort direction ("asc" or "desc") */
  sortDirection?: 'asc' | 'desc';
  /** Pagination page number */
  page?: number;
  /** Items per page */
  limit?: number;
}

/**
 * Get a human-readable date string from an ISO date
 * @param isoDate ISO date string
 * @returns Formatted date string
 */
export const formatOrderDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString();
};

/**
 * Check if an order can be cancelled
 * @param order Order to check
 * @returns Boolean indicating if the order can be cancelled
 */
export const canCancelOrder = (order: Order): boolean => {
  const cancellableStatuses: OrderStatus[] = ['pending', 'confirmed'];
  return cancellableStatuses.includes(order.status);
}; 