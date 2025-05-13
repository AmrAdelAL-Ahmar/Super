export interface OrderItem {
  id: string;
  name: string;
  nameAr: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  nameAr: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface TimelineEvent {
  status: OrderStatus;
  date: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  paymentMethod: 'cash' | 'card';
  shippingAddress: ShippingAddress;
  timeline: TimelineEvent[];
} 