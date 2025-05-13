import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { OrderStatus } from '@/types/order';
import { getStatusInfo } from '@/utils/orderUtils';
import { 
  ClockIcon,
  CheckCircleIcon,
  ReceiptPercentIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface OrderStatusDisplayProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
  className?: string;
}

const OrderStatusDisplay: React.FC<OrderStatusDisplayProps> = ({
  status,
  size = 'small',
  className = '',
}) => {
  const { t } = useTranslation('common');
  const statusInfo = getStatusInfo(status);
  
  const getStatusIcon = () => {
    switch(statusInfo.iconName) {
      case 'clock': 
        return <ClockIcon className="h-5 w-5" />;
      case 'check-circle': 
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'receipt-percent': 
        return <ReceiptPercentIcon className="h-5 w-5" />;
      case 'truck': 
        return <TruckIcon className="h-5 w-5" />;
      case 'x-circle': 
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <Chip 
      label={t(`orders.${status}`)}
      color={statusInfo.color as any}
      icon={getStatusIcon()}
      size={size}
      className={`font-medium ${className}`}
    />
  );
};

export default OrderStatusDisplay; 