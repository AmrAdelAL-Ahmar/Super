import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { TimelineEvent } from '@/types/order';
import { formatDateTime, getStatusInfo } from '@/utils/orderUtils';
import { 
  ClockIcon,
  CheckCircleIcon,
  ReceiptPercentIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface OrderTimelineProps {
  timeline: TimelineEvent[];
  className?: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timeline,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';

  const getStatusIcon = (iconName: string) => {
    switch(iconName) {
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
    <Card variant="outlined" className={className}>
      <Box className="p-4 border-b">
        <Typography variant="h6" className="font-bold">
          {t('orders.orderHistory')}
        </Typography>
      </Box>
      
      <CardContent>
        <Box className="space-y-4">
          {timeline.map((event, index) => {
            const statusInfo = getStatusInfo(event.status);
            
            return (
              <Box 
                key={event.status} 
                className={`flex ${index !== timeline.length - 1 ? 'relative' : ''}`}
              >
                {/* Vertical line */}
                {index !== timeline.length - 1 && (
                  <Box className="absolute left-[10px] top-[20px] bottom-0 w-[2px] bg-gray-200 z-0" />
                )}
                
                {/* Status icon */}
                <Box 
                  className="rounded-full p-1 z-10 mr-4"
                  sx={{
                    backgroundColor: `${statusInfo.color}.light`,
                    color: `${statusInfo.color}.main`
                  }}
                >
                  {getStatusIcon(statusInfo.iconName)}
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" className="font-medium">
                    {t(`orders.${event.status}`)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatDateTime(event.date, locale)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline; 