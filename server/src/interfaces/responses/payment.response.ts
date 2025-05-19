// واجهة استجابة الدفع | Payment Response Interface
export interface IPaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'wallet';
  transactionId?: string;
  transactionDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    walletId?: string;
    walletName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// واجهة استجابة تفاصيل الدفع | Payment Details Response Interface
export interface IPaymentDetailsResponse extends IPaymentResponse {
  order: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
  refund?: {
    id: string;
    amount: number;
    reason: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
  };
}

// واجهة استجابة قائمة المدفوعات | Payment List Response Interface
export interface IPaymentListResponse {
  payments: IPaymentResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    total: number;
    byStatus: {
      [key: string]: number;
    };
    byMethod: {
      [key: string]: number;
    };
  };
}

// واجهة استجابة إحصائيات المدفوعات | Payment Statistics Response Interface
export interface IPaymentStatisticsResponse {
  total: number;
  byStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  byMethod: {
    method: string;
    count: number;
    amount: number;
  }[];
  timeline: {
    date: Date;
    count: number;
    amount: number;
  }[];
  refunds: {
    total: number;
    count: number;
    byReason: {
      reason: string;
      count: number;
      amount: number;
    }[];
  };
} 