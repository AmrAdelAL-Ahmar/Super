import { 
  Order, 
  OrderStatus, 
  OrderFilter, 
  OrderSummary,
  formatOrderDate
} from "@/types/order";
import { handleApiError } from "@/utils/errorHandling";

// API timeout for simulating network delay (ms)
const API_TIMEOUT = 500;

// Mock orders data
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-384192',
    date: '2023-08-15',
    status: 'delivered',
    total: 45.97,
    items: [
      { 
        id: '1', 
        name: 'Fresh Apples', 
        nameAr: 'تفاح طازج', 
        quantity: 2, 
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'
      },
      { 
        id: '3', 
        name: 'Whole Wheat Bread', 
        nameAr: 'خبز القمح الكامل', 
        quantity: 1, 
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
      },
      { 
        id: '5', 
        name: 'Organic Tomatoes', 
        nameAr: 'طماطم عضوية', 
        quantity: 3, 
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924'
      }
    ],
    subtotal: 39.98,
    shippingCost: 5.99,
    discount: 0,
    paymentMethod: 'cash',
    shippingAddress: {
      name: 'Home',
      nameAr: 'المنزل',
      recipient: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '555-123-4567'
    },
    timeline: [
      { status: 'pending', date: '2023-08-14T10:30:00Z' },
      { status: 'confirmed', date: '2023-08-14T11:15:00Z' },
      { status: 'processing', date: '2023-08-14T14:45:00Z' },
      { status: 'outForDelivery', date: '2023-08-15T09:20:00Z' },
      { status: 'delivered', date: '2023-08-15T14:10:00Z' }
    ]
  },
  {
    id: 'ORD-295731',
    date: '2023-07-28',
    status: 'delivered',
    total: 29.45,
    items: [
      { 
        id: '2', 
        name: 'Organic Milk', 
        nameAr: 'حليب عضوي', 
        quantity: 2, 
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b'
      },
      { 
        id: '4', 
        name: 'Fresh Chicken', 
        nameAr: 'دجاج طازج', 
        quantity: 1, 
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791'
      }
    ],
    subtotal: 23.46,
    shippingCost: 5.99,
    discount: 0,
    paymentMethod: 'card',
    shippingAddress: {
      name: 'Home',
      nameAr: 'المنزل',
      recipient: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '555-123-4567'
    },
    timeline: [
      { status: 'pending', date: '2023-07-27T15:20:00Z' },
      { status: 'confirmed', date: '2023-07-27T16:05:00Z' },
      { status: 'processing', date: '2023-07-28T09:30:00Z' },
      { status: 'outForDelivery', date: '2023-07-28T11:15:00Z' },
      { status: 'delivered', date: '2023-07-28T15:45:00Z' }
    ]
  },
  {
    id: 'ORD-104857',
    date: '2023-08-05',
    status: 'processing',
    total: 63.25,
    items: [
      { 
        id: '1', 
        name: 'Fresh Apples', 
        nameAr: 'تفاح طازج', 
        quantity: 1, 
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'
      },
      { 
        id: '2', 
        name: 'Organic Milk', 
        nameAr: 'حليب عضوي', 
        quantity: 3, 
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b'
      },
      { 
        id: '4', 
        name: 'Fresh Chicken', 
        nameAr: 'دجاج طازج', 
        quantity: 2, 
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791'
      }
    ],
    subtotal: 57.26,
    shippingCost: 5.99,
    discount: 0,
    paymentMethod: 'cash',
    shippingAddress: {
      name: 'Work',
      nameAr: 'العمل',
      recipient: 'John Doe',
      street: '456 Office Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      phone: '555-987-6543'
    },
    timeline: [
      { status: 'pending', date: '2023-08-04T19:40:00Z' },
      { status: 'confirmed', date: '2023-08-04T20:15:00Z' },
      { status: 'processing', date: '2023-08-05T10:30:00Z' }
    ]
  }
];

/**
 * Process order data before returning it to the client
 * Adds any calculated fields and ensures consistent formatting
 * 
 * @param order Order data from API
 * @returns Processed order data
 */
const processOrderData = (order: Order): Order => {
  // In a real app, we might do more processing here
  return {
    ...order,
  };
};

/**
 * Convert full order to order summary format for list views
 * 
 * @param order Full order data
 * @returns Order summary
 */
const toOrderSummary = (order: Order): OrderSummary => {
  return {
    id: order.id,
    date: order.date,
    status: order.status,
    total: order.total,
    itemsCount: order.items.length
  };
};

/**
 * Get all orders for the current user
 * 
 * @returns Promise resolving to array of orders
 */
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        const processedOrders = MOCK_ORDERS.map(processOrderData);
        resolve(processedOrders);
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch orders');
  }
};

/**
 * Get order summaries for the current user
 * Lighter-weight version for list views
 * 
 * @returns Promise resolving to array of order summaries
 */
export const getOrderSummaries = async (): Promise<OrderSummary[]> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        const summaries = MOCK_ORDERS.map(toOrderSummary);
        resolve(summaries);
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch order summaries');
  }
};

/**
 * Get a specific order by ID
 * 
 * @param orderId Order ID to retrieve
 * @returns Promise resolving to order or null if not found
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = MOCK_ORDERS.find(order => order.id === orderId) || null;
        resolve(order ? processOrderData(order) : null);
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, `Failed to fetch order with ID: ${orderId}`);
  }
};

/**
 * Get filtered orders based on criteria
 * 
 * @param filter Order filter criteria
 * @returns Promise resolving to filtered orders
 */
export const getFilteredOrders = async (filter: OrderFilter): Promise<Order[]> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredOrders = [...MOCK_ORDERS];
        
        // Apply status filter
        if (filter.status) {
          filteredOrders = filteredOrders.filter(order => order.status === filter.status);
        }
        
        // Apply search filter
        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply date range filter
        if (filter.dateFrom || filter.dateTo) {
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.date).getTime();
            const fromOk = !filter.dateFrom || orderDate >= new Date(filter.dateFrom).getTime();
            const toOk = !filter.dateTo || orderDate <= new Date(filter.dateTo).getTime();
            return fromOk && toOk;
          });
        }
        
        // Apply sorting
        if (filter.sortBy) {
          const direction = filter.sortDirection === 'asc' ? 1 : -1;
          
          switch (filter.sortBy) {
            case 'date':
              filteredOrders.sort((a, b) => 
                direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
              );
              break;
            case 'total':
              filteredOrders.sort((a, b) => 
                direction * (a.total - b.total)
              );
              break;
            // Add other sort options as needed
          }
        }
        
        // Apply pagination if specified
        if (filter.page !== undefined && filter.limit !== undefined) {
          const start = (filter.page - 1) * filter.limit;
          const end = start + filter.limit;
          filteredOrders = filteredOrders.slice(start, end);
        }
        
        resolve(filteredOrders.map(processOrderData));
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, 'Failed to filter orders');
  }
};

/**
 * Cancel an order
 * 
 * @param orderId Order ID to cancel
 * @returns Promise resolving to success status
 */
export const cancelOrder = async (orderId: string): Promise<boolean> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderIndex = MOCK_ORDERS.findIndex(order => order.id === orderId);
        
        // Order not found or already delivered/cancelled
        if (orderIndex === -1 || 
            !['pending', 'confirmed', 'processing'].includes(MOCK_ORDERS[orderIndex].status)) {
          resolve(false);
          return;
        }
        
        // In a real app, this would update the database
        MOCK_ORDERS[orderIndex].status = 'cancelled';
        MOCK_ORDERS[orderIndex].timeline.push({
          status: 'cancelled',
          date: new Date().toISOString()
        });
        
        resolve(true);
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, `Failed to cancel order with ID: ${orderId}`, false);
  }
};

/**
 * Reorder items from a previous order
 * 
 * @param orderId Order ID to reorder
 * @returns Promise resolving to success status
 */
export const reorderItems = async (orderId: string): Promise<boolean> => {
  try {
    // In a real app, this would be a fetch call to the API
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = MOCK_ORDERS.find(order => order.id === orderId);
        
        // Order not found
        if (!order) {
          resolve(false);
          return;
        }
        
        // In a real app, this would add the items to the user's cart
        resolve(true);
      }, API_TIMEOUT);
    });
  } catch (error) {
    return handleApiError(error, `Failed to reorder items from order with ID: ${orderId}`, false);
  }
}; 