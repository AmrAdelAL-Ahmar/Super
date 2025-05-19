import { User } from '@/types/user';
import { AlertSeverity, PageAccessControl } from '@/types/dashboard';
import { Order, OrderStatus } from '@/types/order';
import { NextRouter } from 'next/router';

/**
 * Check access control for dashboard pages
 * 
 * @param user Currently logged in user
 * @param router Next.js router instance
 * @param accessControl Access control configuration
 * @returns Boolean indicating if access check passed
 */
export const checkPageAccess = (
  user: User | null, 
  router: NextRouter, 
  accessControl: PageAccessControl
): boolean => {
  if (!user) {
    router.push(`/login?returnUrl=${router.pathname}`);
    return false;
  }

  if (user.role !== accessControl.requiredRole) {
    router.push(accessControl.redirectPath);
    return false;
  }

  return true;
};

/**
 * Format currency for display
 * 
 * @param amount Number to format as currency
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format date for display
 * 
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Show alert message with timeout
 * 
 * @param message Alert message
 * @param severity Alert severity
 * @param setAlertMessage State setter for alert message
 * @param setAlertSeverity State setter for alert severity
 * @param setShowAlert State setter for alert visibility
 */
export const showAlertMessage = (
  message: string, 
  severity: AlertSeverity,
  setAlertMessage: (message: string) => void,
  setAlertSeverity: (severity: AlertSeverity) => void,
  setShowAlert: (show: boolean) => void
): void => {
  setAlertMessage(message);
  setAlertSeverity(severity);
  setShowAlert(true);
};

/**
 * Calculate statistics from orders data
 * 
 * @param orders Array of orders
 * @returns Calculated statistics
 */
export const calculateOrderStats = (orders: Order[]) => {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed'].includes(order.status)
  ).length;
  
  const processingOrders = orders.filter(order => 
    order.status === 'processing'
  ).length;
  
  const deliveredOrders = orders.filter(order => 
    order.status === 'delivered'
  ).length;
  
  // Calculate best-selling items
  const itemsMap = new Map<string, number>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const currentQuantity = itemsMap.get(item.name) || 0;
      itemsMap.set(item.name, currentQuantity + item.quantity);
    });
  });
  
  const bestSellingItems = Array.from(itemsMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  return {
    totalSales,
    totalOrders,
    averageOrderValue,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    bestSellingItems
  };
}; 