import { PaymentMethod } from '../models/payment.interface';

// واجهة طلب معالجة الدفع | Process Payment Request Interface
export interface IProcessPaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardHolderName?: string;
    walletId?: string;
  };
}

// واجهة طلب استرداد الدفع | Refund Request Interface
export interface IRefundRequest {
  orderId: string;
  amount?: number; // إذا كان الاسترداد جزئيًا | If partial refund
  reason: string;
}

// واجهة طلب التحقق من حالة الدفع | Check Payment Status Request Interface
export interface ICheckPaymentStatusRequest {
  orderId: string;
  transactionId?: string;
}

// واجهة طلب تحديث تفاصيل الدفع | Update Payment Details Request Interface
export interface IUpdatePaymentDetailsRequest {
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardHolderName?: string;
    walletId?: string;
  };
}

// واجهة طلب تحديث حالة الدفع | Update Payment Status Request Interface
export interface IUpdatePaymentStatusRequest {
  status: string;
  transactionId?: string;
  transactionDetails?: any;
}

// واجهة طلب تصفية المدفوعات | Filter Payments Request Interface
export interface IFilterPaymentsRequest {
  status?: string;
  method?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 