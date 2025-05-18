// واجهة إحصائيات المتجر | Store Statistics Interface
export interface IStoreStatistics {
  _id: string;
  storeId: string;
  date: Date;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  topSellingProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  categoryDistribution: {
    categoryId: string;
    name: string;
    percentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// واجهة إحصائيات النظام | System Statistics Interface
export interface ISystemStatistics {
  _id: string;
  date: Date;
  totalStores: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  newUsers: number;
  topStores: {
    storeId: string;
    name: string;
    orders: number;
    revenue: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 