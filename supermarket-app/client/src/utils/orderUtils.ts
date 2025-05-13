import { OrderStatus } from "@/types/order";

export const getStatusInfo = (status: OrderStatus) => {
  switch(status) {
    case 'pending':
      return { 
        color: 'warning', 
        iconName: 'clock'
      };
    case 'confirmed':
      return { 
        color: 'info', 
        iconName: 'check-circle'
      };
    case 'processing':
      return { 
        color: 'primary', 
        iconName: 'receipt-percent'
      };
    case 'outForDelivery':
      return { 
        color: 'secondary', 
        iconName: 'truck'
      };
    case 'delivered':
      return { 
        color: 'success', 
        iconName: 'check-circle'
      };
    case 'cancelled':
      return { 
        color: 'error', 
        iconName: 'x-circle'
      };
    default:
      return { 
        color: 'default', 
        iconName: 'clock'
      };
  }
};

export const getStatusStep = (status: OrderStatus) => {
  switch(status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'processing': return 2;
    case 'outForDelivery': return 3;
    case 'delivered': return 4;
    case 'cancelled': return -1;
    default: return 0;
  }
};

export const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 