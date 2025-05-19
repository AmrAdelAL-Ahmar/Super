import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  List, 
  ListItem, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Chip,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  MapPinIcon, 
  ClockIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import { PendingOrder } from '@/types/delivery';

interface DeliveryOrdersListProps {
  orders: PendingOrder[];
}

const DeliveryOrdersList: React.FC<DeliveryOrdersListProps> = ({ orders }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString(router.locale, { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleAcceptOrder = (orderId: string) => {
    // In a real app, this would call an API to accept the order
    console.log(`Accepting order: ${orderId}`);
    router.push(`/delivery/orders/${orderId}`);
  };
  
  const handleRejectOrder = (orderId: string) => {
    // In a real app, this would call an API to reject the order
    console.log(`Rejecting order: ${orderId}`);
  };
  
  if (orders.length === 0) {
    return (
      <Box className="text-center py-6">
        <Typography variant="body1" color="textSecondary">
          {t('delivery.noPendingOrders')}
        </Typography>
      </Box>
    );
  }
  
  return (
    <List disablePadding>
      {orders.map((order, index) => (
        <React.Fragment key={order.id}>
          {index > 0 && <Divider component="li" />}
          <ListItem alignItems="flex-start" className="py-3">
            <Box className="w-full">
              <Box className="flex justify-between items-center mb-2">
                <Typography variant="subtitle1" className="font-medium">
                  {order.id}
                </Typography>
                <Chip 
                  label={formatTime(order.assignedAt)} 
                  size="small"
                  variant="outlined"
                  icon={<ClockIcon className="h-4 w-4" />}
                />
              </Box>
              
              <Box className="flex items-center mb-2">
                <ShoppingBagIcon className="h-5 w-5 text-gray-500 mr-2" />
                <Typography variant="body2">
                  {t('delivery.itemsCount', { count: order.items })}
                </Typography>
              </Box>
              
              <Box className="flex items-center mb-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                <Typography variant="body2">
                  {order.store} • {order.distance.toFixed(1)} km
                </Typography>
              </Box>
              
              <Box className="flex items-center mb-3">
                <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                <Typography variant="body2">
                  {t('delivery.estimatedTime', { minutes: order.estimatedTime })}
                </Typography>
              </Box>
              
              <Box className="flex justify-between gap-2">
                <Button 
                  variant="outlined" 
                  color="error"
                  size="small"
                  onClick={() => handleRejectOrder(order.id)}
                  className="flex-1"
                >
                  {t('delivery.reject')}
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="small"
                  onClick={() => handleAcceptOrder(order.id)}
                  className="flex-1"
                >
                  {t('delivery.accept')}
                </Button>
              </Box>
            </Box>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

export default DeliveryOrdersList; 