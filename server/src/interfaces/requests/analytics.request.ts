// واجهة طلب تصفية الإحصائيات | Filter Analytics Request Interface
export interface IFilterAnalyticsRequest {
  startDate: Date;
  endDate: Date;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

// واجهة طلب إحصائيات المبيعات | Sales Statistics Request Interface
export interface ISalesStatisticsRequest extends IFilterAnalyticsRequest {
  includeRefunds?: boolean;
  includeCancelled?: boolean;
  paymentMethod?: string;
}

// واجهة طلب إحصائيات المنتجات | Product Statistics Request Interface
export interface IProductStatisticsRequest extends IFilterAnalyticsRequest {
  categoryId?: string;
  includeOutOfStock?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

// واجهة طلب إحصائيات العملاء | Customer Statistics Request Interface
export interface ICustomerStatisticsRequest extends IFilterAnalyticsRequest {
  includeInactive?: boolean;
  minOrders?: number;
  maxOrders?: number;
}

// واجهة طلب إحصائيات الموظفين | Employee Statistics Request Interface
export interface IEmployeeStatisticsRequest extends IFilterAnalyticsRequest {
  includeInactive?: boolean;
  minDeliveries?: number;
  maxDeliveries?: number;
  minRating?: number;
  maxRating?: number;
}

// واجهة طلب تصدير التقارير | Export Report Request Interface
export interface IExportReportRequest {
  type: 'sales' | 'products' | 'customers' | 'employees';
  format: 'csv' | 'excel' | 'pdf';
  filters: IFilterAnalyticsRequest;
  includeCharts?: boolean;
  includeDetails?: boolean;
} 