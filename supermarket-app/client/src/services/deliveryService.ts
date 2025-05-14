import { Delivery, DeliveryPerson, DeliveryStatus, PendingOrder, DeliveryHistory, Rating, RatingSummary, Notification, DeliverySettings } from "@/types/delivery";

// Mock active delivery
const MOCK_ACTIVE_DELIVERY: Delivery = {
  id: 'ORD-789012',
  customer: {
    name: 'Sara Ahmed',
    phone: '555-987-6543',
    address: '123 Main St, Apartment 4B, Cairo',
    location: { lat: 30.0444, lng: 31.2357 } // Cairo coordinates
  },
  store: {
    name: 'SuperMart Downtown',
    address: '456 Market St, Cairo',
    location: { lat: 30.0500, lng: 31.2300 }
  },
  status: 'picked_up',
  items: [
    { name: 'Milk', quantity: 2, price: 3.99 },
    { name: 'Bread', quantity: 1, price: 2.49 },
    { name: 'Eggs', quantity: 1, price: 4.99 }
  ],
  subtotal: 15.46,
  deliveryFee: 3.99,
  total: 19.45,
  paymentMethod: 'Cash on Delivery',
  assignedAt: '2023-08-15T14:30:00Z',
  acceptedAt: '2023-08-15T14:35:00Z',
  pickedUpAt: '2023-08-15T14:50:00Z',
  estimatedDeliveryTime: '2023-08-15T15:15:00Z'
};

// Mock pending orders
const MOCK_PENDING_ORDERS: PendingOrder[] = [
  {
    id: 'ORD-345678',
    store: 'SuperMart Heliopolis',
    items: 5,
    distance: 3.2,
    estimatedTime: 15,
    assignedAt: '2023-08-15T15:45:00Z'
  },
  {
    id: 'ORD-456789',
    store: 'SuperMart Maadi',
    items: 8,
    distance: 5.7,
    estimatedTime: 25,
    assignedAt: '2023-08-15T16:00:00Z'
  }
];

// Mock delivery person data
const MOCK_DELIVERY_PERSON: DeliveryPerson = {
  id: 'DEL-123456',
  name: 'Ahmed Hassan',
  ratings: 4.8,
  totalDeliveries: 156,
  completedToday: 5,
  earnings: {
    today: 45.50,
    week: 320.75,
    month: 1250.30
  }
};

// Mock delivery history
const MOCK_HISTORY: DeliveryHistory[] = [
  {
    id: 'ORD-123456',
    date: '2023-08-14',
    customer: 'John Doe',
    address: '123 Main St, New York',
    status: 'delivered',
    amount: 24.99,
    rating: 5
  },
  {
    id: 'ORD-123455',
    date: '2023-08-13',
    customer: 'Jane Smith',
    address: '456 Oak Ave, New York',
    status: 'delivered',
    amount: 32.50,
    rating: 4
  },
  {
    id: 'ORD-123454',
    date: '2023-08-12',
    customer: 'Bob Johnson',
    address: '789 Pine St, New York',
    status: 'cancelled',
    amount: 18.75,
    rating: null
  },
  {
    id: 'ORD-123453',
    date: '2023-08-11',
    customer: 'Alice Brown',
    address: '101 Maple Rd, New York',
    status: 'delivered',
    amount: 45.20,
    rating: 5
  },
  {
    id: 'ORD-123452',
    date: '2023-08-10',
    customer: 'Charlie Wilson',
    address: '202 Cedar Ln, New York',
    status: 'delivered',
    amount: 29.99,
    rating: 3
  },
  {
    id: 'ORD-123451',
    date: '2023-08-09',
    customer: 'Diana Miller',
    address: '303 Birch Blvd, New York',
    status: 'cancelled',
    amount: 15.50,
    rating: null
  }
];

// Mock ratings data
const MOCK_RATINGS: Rating[] = [
  {
    id: 'RTG-001',
    orderId: 'ORD-123456',
    customerId: 'USR-001',
    customerName: 'John Doe',
    value: 5,
    comment: 'Very professional and fast delivery. The driver was friendly and helpful.',
    date: '2023-08-14T18:30:00Z'
  },
  {
    id: 'RTG-002',
    orderId: 'ORD-123455',
    customerId: 'USR-002',
    customerName: 'Jane Smith',
    value: 4,
    comment: 'Good service, but arrived a bit later than expected.',
    date: '2023-08-13T19:45:00Z'
  },
  {
    id: 'RTG-003',
    orderId: 'ORD-123453',
    customerId: 'USR-003',
    customerName: 'Alice Brown',
    value: 5,
    comment: 'Excellent service! The delivery person was very careful with my groceries.',
    date: '2023-08-11T17:20:00Z'
  },
  {
    id: 'RTG-004',
    orderId: 'ORD-123452',
    customerId: 'USR-004',
    customerName: 'Charlie Wilson',
    value: 3,
    date: '2023-08-10T16:15:00Z'
  }
];

// Mock rating summary
const MOCK_RATING_SUMMARY: RatingSummary = {
  average: 4.25,
  total: 4,
  distribution: {
    5: 2,
    4: 1,
    3: 1,
    2: 0,
    1: 0
  }
};

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'new_order',
    title: 'New Order',
    message: 'You have been assigned a new delivery order.',
    orderId: 'ORD-789012',
    timestamp: '2023-08-15T14:30:00Z',
    read: false
  },
  {
    id: 'NOTIF-002',
    type: 'order_updated',
    title: 'Order Updated',
    message: 'Order #ORD-123456 status has been updated to delivered.',
    orderId: 'ORD-123456',
    timestamp: '2023-08-14T18:30:00Z',
    read: true
  },
  {
    id: 'NOTIF-003',
    type: 'system',
    title: 'System Announcement',
    message: 'The app will undergo maintenance tonight from 2 AM to 4 AM.',
    timestamp: '2023-08-14T10:00:00Z',
    read: false
  },
  {
    id: 'NOTIF-004',
    type: 'order_cancelled',
    title: 'Order Cancelled',
    message: 'Order #ORD-123454 has been cancelled by the customer.',
    orderId: 'ORD-123454',
    timestamp: '2023-08-12T15:45:00Z',
    read: true
  }
];

// Mock settings
const MOCK_SETTINGS: DeliverySettings = {
  account: {
    name: 'Ahmed Hassan',
    phone: '555-123-4567',
    email: 'ahmed.hassan@example.com'
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    newOrderAlerts: true,
    orderUpdates: true,
    systemAnnouncements: false,
    soundAlerts: true,
    vibration: true
  },
  navigation: {
    preferredMapsApp: 'google',
    avoidTolls: false,
    avoidHighways: false,
    nightMode: true
  },
  language: 'en',
  theme: 'system'
};

/**
 * Get the delivery person's profile and stats
 */
export const getDeliveryPersonProfile = async (): Promise<DeliveryPerson> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DELIVERY_PERSON), 500);
  });
};

/**
 * Get the current active delivery
 */
export const getActiveDelivery = async (): Promise<Delivery | null> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ACTIVE_DELIVERY), 500);
  });
};

/**
 * Get pending orders available for delivery
 */
export const getPendingOrders = async (): Promise<PendingOrder[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PENDING_ORDERS), 500);
  });
};

/**
 * Get a specific delivery by ID
 */
export const getDeliveryById = async (deliveryId: string): Promise<Delivery | null> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (MOCK_ACTIVE_DELIVERY.id === deliveryId) {
        resolve(MOCK_ACTIVE_DELIVERY);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Update delivery status
 */
export const updateDeliveryStatus = async (
  deliveryId: string, 
  status: DeliveryStatus
): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};

/**
 * Get delivery history
 */
export const getDeliveryHistory = async (): Promise<DeliveryHistory[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_HISTORY), 500);
  });
};

/**
 * Update delivery person status (online/offline)
 */
export const updateDeliveryPersonStatus = async (
  status: 'online' | 'offline' | 'busy'
): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};

/**
 * Get delivery person ratings
 */
export const getDeliveryRatings = async (): Promise<Rating[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RATINGS), 500);
  });
};

/**
 * Get delivery person rating summary
 */
export const getDeliveryRatingSummary = async (): Promise<RatingSummary> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RATING_SUMMARY), 500);
  });
};

/**
 * Get delivery person notifications
 */
export const getDeliveryNotifications = async (): Promise<Notification[]> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_NOTIFICATIONS), 500);
  });
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};

/**
 * Get delivery person settings
 */
export const getDeliverySettings = async (): Promise<DeliverySettings> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SETTINGS), 500);
  });
};

/**
 * Update delivery person settings
 */
export const updateDeliverySettings = async (settings: DeliverySettings): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
}; 