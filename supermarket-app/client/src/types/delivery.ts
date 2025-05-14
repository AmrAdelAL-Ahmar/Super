export interface Location {
  lat: number;
  lng: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  location: Location;
}

export interface Store {
  name: string;
  address: string;
  location: Location;
}

export interface DeliveryItem {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
}

export type DeliveryStatus = 
  | 'assigned' 
  | 'accepted' 
  | 'picked_up' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled';

export interface Delivery {
  id: string;
  customer: Customer;
  store: Store;
  status: DeliveryStatus;
  items: DeliveryItem[];
  assignedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  estimatedDeliveryTime: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  paymentMethod?: 'Cash on Delivery' | 'Card' | 'Online';
}

export interface PendingOrder {
  id: string;
  store: string;
  items: number;
  distance: number;
  estimatedTime: number;
  assignedAt: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  ratings: number;
  totalDeliveries: number;
  completedToday: number;
  earnings: {
    today: number;
    week: number;
    month: number;
  };
}

export interface DeliveryHistory {
  id: string;
  date: string;
  customer: string;
  address: string;
  status: 'delivered' | 'cancelled';
  amount: number;
  rating: number | null;
}

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Rating {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  value: RatingValue;
  comment?: string;
  date: string;
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type NotificationType = 
  | 'new_order' 
  | 'order_cancelled' 
  | 'order_updated' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  timestamp: string;
  read: boolean;
}

export interface DeliverySettings {
  account: {
    name: string;
    phone: string;
    email: string;
  };
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    newOrderAlerts: boolean;
    orderUpdates: boolean;
    systemAnnouncements: boolean;
    soundAlerts: boolean;
    vibration: boolean;
  };
  navigation: {
    preferredMapsApp: 'google' | 'apple' | 'waze' | 'default';
    avoidTolls: boolean;
    avoidHighways: boolean;
    nightMode: boolean;
  };
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
} 