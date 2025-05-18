import { OrderStatus } from '../models/order.interface';
import { PaymentMethod, PaymentStatus } from '../models/payment.interface';

// واجهة استجابة السلة | Cart Response Interface
export interface ICartResponse {
  id: string;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  estimatedTax?: number;
  estimatedShipping?: number;
  total: number;
}

// واجهة استجابة الطلب | Order Response Interface
export interface IOrderResponse {
  id: string;
  orderNumber: string;
  date: Date;
  status: OrderStatus;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: {
    title: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryEmployee?: {
    id: string;
    name: string;
    phone: string;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  timeline: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
}

// واجهة استجابة قائمة الطلبات | Order List Response Interface
export interface IOrderListResponse {
  orders: IOrderResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// واجهة استجابة ملخص الطلب | Order Summary Response Interface
export interface IOrderSummaryResponse {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemsCount: number;
  createdAt: Date;
  estimatedDeliveryTime?: Date;
} 