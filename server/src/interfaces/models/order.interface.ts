import { PaymentMethod, PaymentStatus } from './payment.interface';

// حالة الطلب | Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// واجهة عنصر الطلب | Order Item Interface
export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
}

// واجهة الطلب | Order Interface
export interface IOrder {
  _id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddressId: string;
  deliveryEmployeeId?: string;
  deliveryNotes?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export interface IPayment {
//   _id: string;
//   orderId: string;
//   customerId: string;
//   amount: number;
//   method: PaymentMethod;
//   status: PaymentStatus;
//   transactionId?: string;
//   transactionDetails?: any;
//   refundId?: string;
//   refundAmount?: number;
//   refundReason?: string;
//   createdAt: Date;
//   updatedAt: Date;
// } 