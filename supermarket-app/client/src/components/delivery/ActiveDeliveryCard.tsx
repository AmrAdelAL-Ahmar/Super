import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Divider, 
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { Delivery, DeliveryStatus } from '@/types/delivery';

const ActiveDeliveryCard: React.FC<{ delivery: Delivery }> = ({ delivery }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString(router.locale, { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStatusColor = (status: DeliveryStatus): string => {
    switch (status) {
      case 'assigned': return 'default';
      case 'accepted': return 'primary';
      case 'picked_up': return 'info';
      case 'on_the_way': return 'warning';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  const handleCallCustomer = () => {
    window.location.href = `tel:${delivery.customer.phone}`;
  };
  
  const handleNavigate = () => {
    // In a real app, this would open navigation to the customer's location
    // For now, we'll just navigate to the map page
    router.push(`/delivery/map?lat=${delivery.customer.location.lat}&lng=${delivery.customer.location.lng}`);
  };
  
  const handleUpdateStatus = () => {
    // In a real app, this would update the delivery status
    router.push(`/delivery/orders/${delivery.id}/update`);
  };
  
  return (
    <Box>
      <Box className="flex justify-between items-center mb-3">
        <Typography variant="h6" className="font-medium">
          {delivery.id}
        </Typography>
        <Chip 
          label={t(`delivery.status.${delivery.status}`)} 
          color={getStatusColor(delivery.status) as any}
          size="small"
        />
      </Box>
      
      <Grid container spacing={2} className="mb-3">
        <Grid item xs={12} sm={6}>
          <Box className="flex items-center mb-2">
            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
            <Typography variant="body2" className="font-medium">
              {t('delivery.customerLocation')}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" className="ml-7">
            {delivery.customer.address}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            <Typography variant="body2" className="font-medium">
              {t('delivery.estimatedDelivery')}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" className="ml-7">
            {formatTime(delivery.estimatedDeliveryTime)}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider className="my-3" />
      
      <Box className="mb-3">
        <Box className="flex items-center mb-2">
          <ShoppingBagIcon className="h-5 w-5 text-gray-500 mr-2" />
          <Typography variant="body2" className="font-medium">
            {t('delivery.orderItems')}
          </Typography>
        </Box>
        <List dense disablePadding className="ml-7">
          {delivery.items.map((item, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText 
                primary={`${item.name} x${item.quantity}`}
                className="my-0 py-0"
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider className="my-3" />
      
      <Box className="flex items-center mb-3">
        <Typography variant="body2" className="font-medium mr-2">
          {t('delivery.customer')}:
        </Typography>
        <Typography variant="body2">
          {delivery.customer.name}
        </Typography>
      </Box>
      
      <Box className="flex justify-between gap-2">
        <Button 
          variant="outlined" 
          startIcon={<PhoneIcon className="h-5 w-5" />}
          onClick={handleCallCustomer}
          size="small"
        >
          {t('delivery.call')}
        </Button>
        
        <Button 
          variant="outlined"
          startIcon={<MapPinIcon className="h-5 w-5" />}
          onClick={handleNavigate}
          size="small"
          color="primary"
        >
          {t('delivery.navigate')}
        </Button>
        
        <Button 
          variant="contained"
          startIcon={<CheckIcon className="h-5 w-5" />}
          onClick={handleUpdateStatus}
          size="small"
          color="primary"
        >
          {t('delivery.updateStatus')}
        </Button>
      </Box>
    </Box>
  );
};

export default ActiveDeliveryCard; 