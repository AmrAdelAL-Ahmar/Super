// واجهة استجابة إحصائيات المبيعات | Sales Statistics Response Interface
export interface ISalesStatisticsResponse {
  total: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
  };
  byStatus: {
    status: string;
    count: number;
    revenue: number;
  }[];
  byPaymentMethod: {
    method: string;
    count: number;
    revenue: number;
  }[];
  timeline: {
    date: Date;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  topCategories: {
    categoryId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

// واجهة استجابة إحصائيات المنتجات | Product Analytics Response Interface
export interface IProductAnalyticsResponse {
  total: {
    products: number;
    categories: number;
    outOfStock: number;
    lowStock: number;
  };
  byCategory: {
    categoryId: string;
    name: string;
    count: number;
    revenue: number;
  }[];
  stockStatus: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  topSelling: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  timeline: {
    date: Date;
    newProducts: number;
    totalProducts: number;
    revenue: number;
  }[];
}

// واجهة استجابة إحصائيات العملاء | Customer Analytics Response Interface
export interface ICustomerAnalyticsResponse {
  total: {
    customers: number;
    activeCustomers: number;
    newCustomers: number;
  };
  bySegment: {
    segment: string;
    count: number;
    revenue: number;
  }[];
  topCustomers: {
    userId: string;
    name: string;
    orders: number;
    revenue: number;
  }[];
  timeline: {
    date: Date;
    newCustomers: number;
    activeCustomers: number;
    revenue: number;
  }[];
  customerRetention: {
    period: string;
    retentionRate: number;
    churnRate: number;
  }[];
}

// واجهة استجابة إحصائيات الموظفين | Employee Analytics Response Interface
export interface IEmployeeAnalyticsResponse {
  total: {
    employees: number;
    activeEmployees: number;
    deliveries: number;
  };
  byRole: {
    role: string;
    count: number;
    performance: number;
  }[];
  topPerformers: {
    employeeId: string;
    name: string;
    deliveries: number;
    rating: number;
  }[];
  timeline: {
    date: Date;
    deliveries: number;
    averageRating: number;
  }[];
  performance: {
    metric: string;
    value: number;
    target: number;
    status: 'above' | 'below' | 'at';
  }[];
}

// واجهة استجابة التقرير | Report Response Interface
export interface IReportResponse {
  type: 'sales' | 'products' | 'customers' | 'employees';
  format: 'csv' | 'excel' | 'pdf';
  data: any;
  metadata: {
    generatedAt: Date;
    period: {
      start: Date;
      end: Date;
    };
    filters: {
      [key: string]: any;
    };
  };
  charts?: {
    type: string;
    data: any;
  }[];
} 