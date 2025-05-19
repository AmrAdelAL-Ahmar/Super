import { PaymentMethod } from '../models/payment.interface';

// واجهة طلب إنشاء طلب | Create Order Request Interface
export interface ICreateOrderRequest {
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  deliveryNotes?: string;
}

// واجهة طلب تحديث حالة الطلب | Update Order Status Request Interface
export interface IUpdateOrderStatusRequest {
  status: string;
  reason?: string; // للإلغاء | For cancellation
}

// واجهة طلب تعيين موظف توصيل للطلب | Assign Delivery Employee Request Interface
export interface IAssignDeliveryEmployeeRequest {
  deliveryEmployeeId: string;
}

// واجهة طلب تحديث موقع التوصيل | Update Delivery Location Request Interface
export interface IUpdateDeliveryLocationRequest {
  lat: number;
  lng: number;
}

// واجهة طلب تصفية الطلبات | Filter Orders Request Interface
export interface IFilterOrdersRequest {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 