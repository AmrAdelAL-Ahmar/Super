import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { Product } from './product';
import { Order } from './order';
import { User, UserRole } from './user';

/**
 * Dashboard menu item interface
 */
export interface DashboardMenuItem {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
}

/**
 * Dashboard page base props
 */
export interface DashboardPageProps {
  locale: string;
}

/**
 * Dashboard page state
 */
export interface DashboardPageState {
  loading: boolean;
  error: string | null;
}

/**
 * Product management interfaces
 */
export interface ProductPageState extends DashboardPageState {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  alertMessage: string;
  alertSeverity: 'success' | 'error';
  showAlert: boolean;
}

/**
 * Order management interfaces
 */
export interface OrderPageState extends DashboardPageState {
  orders: Order[];
  filteredOrders: Order[];
  searchTerm: string;
  alertMessage: string;
  alertSeverity: 'success' | 'error';
  showAlert: boolean;
  tabValue: number;
}

/**
 * Employee management interfaces
 */
export interface EmployeePageState extends DashboardPageState {
  employees: User[];
  filteredEmployees: User[];
  searchTerm: string;
  alertMessage: string;
  alertSeverity: 'success' | 'error';
  showAlert: boolean;
}

/**
 * Statistics interfaces
 */
export interface StatCard {
  title: string;
  value: string;
  icon: ReactNode;
}

export interface OrderStatusItem {
  label: string;
  value: number;
  color: string;
}

export interface Stats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  bestSellingItems: { name: string; quantity: number }[];
}

export interface StatisticsPageState extends DashboardPageState {
  stats: Stats;
}

/**
 * Common dashboard utility types
 */
export type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

/**
 * Access control
 */
export interface PageAccessControl {
  requiredRole: UserRole;
  redirectPath: string;
} 