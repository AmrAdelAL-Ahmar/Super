import { OrderStatus } from '../models/order.interface';
import { PaymentMethod } from '../models/payment.interface';

// واجهة طلب إضافة منتج للسلة | Add Item to Cart Request Interface
export interface IAddToCartRequest {
  productId: string;
  quantity: number;
}

// واجهة طلب تحديث كمية منتج في السلة | Update Cart Item Request Interface
export interface IUpdateCartItemRequest {
  quantity: number;
}

// واجهة طلب إنشاء طلب | Create Order Request Interface
export interface ICreateOrderRequest {
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  deliveryNotes?: string;
}

// واجهة طلب تحديث حالة الطلب | Update Order Status Request Interface
export interface IUpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string; // للإلغاء | For cancellation
}

// واجهة طلب تعيين موظف توصيل للطلب | Assign Delivery Employee Request Interface
export interface IAssignDeliveryEmployeeRequest {
  deliveryEmployeeId: string;
} 