// طريقة الدفع | Payment Method
export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  DIGITAL_WALLET = 'digital_wallet'
}

// حالة الدفع | Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// واجهة الدفع | Payment Interface
export interface IPayment {
  _id: string;
  orderId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  transactionDetails?: any;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  refundDetails?: {
    reason: string;
    refundedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
} 