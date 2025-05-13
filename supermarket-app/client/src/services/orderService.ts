import { Order } from "@/types/order";

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
 * Get all orders for the current user
 */
export const getUserOrders = async (): Promise<Order[]> => {
  // In a real app, this would be a fetch call to the API
  // For now, we'll just return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ORDERS), 500);
  });
};

/**
 * Get a specific order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  // In a real app, this would be a fetch call to the API
  // For now, we'll just filter the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = MOCK_ORDERS.find(order => order.id === orderId) || null;
      resolve(order);
    }, 500);
  });
};

/**
 * Reorder items from a previous order
 */
export const reorderItems = async (orderId: string): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  // For now, we'll just return success
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
}; 