import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Button, 
  Chip,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { Order, formatOrderDate } from '@/types/order';

interface OrderDetailsProps {
  order: Order;
  onCancelOrder?: () => void;
  onReorder?: () => void;
  className?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  order, 
  onCancelOrder, 
  onReorder,
  className = '' 
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const isRTL = locale === 'ar';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Paper elevation={1} className="p-4">
        <Typography variant="h6" className="font-medium mb-4">
          {t('order.orderDetails', 'Order Details')}
        </Typography>
        
        <Box className="mb-4">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                {t('order.id', 'Order ID')}
              </Typography>
              <Typography variant="body1" className="font-medium">
                {order.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                {t('order.date', 'Order Date')}
              </Typography>
              <Typography variant="body1" className="font-medium">
                {formatOrderDate(order.date)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                {t('order.status', 'Status')}
              </Typography>
              <Chip 
                label={t(`order.status.${order.status}`, order.status)} 
                color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'primary'} 
                size="small"
                className="mt-1"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                {t('order.paymentMethod', 'Payment Method')}
              </Typography>
              <Typography variant="body1" className="font-medium">
                {t(`order.payment.${order.paymentMethod}`, order.paymentMethod)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Divider className="my-4" />
        
        <Typography variant="subtitle1" className="font-medium mb-2">
          {t('order.items', 'Items')}
        </Typography>
        
        <List className="mb-4 px-0">
          {order.items.map((item) => (
            <ListItem key={item.id + item.name} className="px-0 py-2">
              <ListItemAvatar>
                <Avatar 
                  variant="rounded" 
                  src={item.image} 
                  alt={isRTL ? item.nameAr : item.name}
                  className="border"
                />
              </ListItemAvatar>
              <ListItemText 
                primary={isRTL ? item.nameAr : item.name}
                secondary={`${item.quantity} x $${item.price.toFixed(2)}`}
              />
              <Typography variant="body2" className="font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
        
        <Box className="bg-gray-50 p-3 rounded-md mb-4">
          <Box className="flex justify-between mb-2">
            <Typography variant="body2" color="textSecondary">
              {t('order.subtotal', 'Subtotal')}
            </Typography>
            <Typography variant="body2">
              ${order.subtotal.toFixed(2)}
            </Typography>
          </Box>
          
          <Box className="flex justify-between mb-2">
            <Typography variant="body2" color="textSecondary">
              {t('order.shipping', 'Shipping')}
            </Typography>
            <Typography variant="body2">
              ${order.shippingCost.toFixed(2)}
            </Typography>
          </Box>
          
          {order.discount > 0 && (
            <Box className="flex justify-between mb-2">
              <Typography variant="body2" color="textSecondary">
                {t('order.discount', 'Discount')}
              </Typography>
              <Typography variant="body2" color="error">
                -${order.discount.toFixed(2)}
              </Typography>
            </Box>
          )}
          
          <Divider className="my-2" />
          
          <Box className="flex justify-between">
            <Typography variant="subtitle2" className="font-bold">
              {t('order.total', 'Total')}
            </Typography>
            <Typography variant="subtitle2" className="font-bold">
              ${order.total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        
        <Box className="mb-4">
          <Typography variant="subtitle1" className="font-medium mb-2">
            {t('order.deliveryAddress', 'Delivery Address')}
          </Typography>
          
          <Paper variant="outlined" className="p-3">
            <Typography variant="body2" className="font-medium">
              {order.shippingAddress.recipient}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.street}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Typography>
            <Typography variant="body2">
              {t('order.phone', 'Phone')}: {order.shippingAddress.phone}
            </Typography>
          </Paper>
        </Box>
        
        <Box className="flex justify-between space-x-2">
          {onCancelOrder && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={onCancelOrder}
              className="flex-1"
            >
              {t('order.cancel', 'Cancel Order')}
            </Button>
          )}
          
          {onReorder && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onReorder}
              className="flex-1"
            >
              {t('order.reorder', 'Reorder')}
            </Button>
          )}
          
          <Link href="/orders" passHref legacyBehavior>
            <Button 
              variant="outlined" 
              component="a"
              className="flex-1"
            >
              {t('common.back', 'Back')}
            </Button>
          </Link>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default OrderDetails; 