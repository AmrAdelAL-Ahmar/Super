import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Typography, Card, CardContent, CardActions, Button, Divider } from '@mui/material';
import { ArrowTopRightOnSquareIcon, ArrowUturnLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Order } from '@/types/order';
import { formatDate } from '@/utils/orderUtils';
import OrderStatusDisplay from './OrderStatusDisplay';

interface OrderCardProps {
  order: Order;
  onReorder?: (orderId: string) => void;
  onTrack?: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onReorder,
  onTrack,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="outlined">
        <Box className="flex flex-wrap items-center justify-between p-4 border-b">
          <Box className="mb-2 md:mb-0">
            <Typography variant="h6" className="font-bold">
              {order.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(order.date, locale)}
            </Typography>
          </Box>
          
          <Box className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <OrderStatusDisplay status={order.status} />
            
            <Typography variant="h6" className="font-bold">
              ${order.total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" className="mb-2">
            {t('order.items')}:
          </Typography>
          
          <Box className="space-y-2 mb-4">
            {order.items.map((item) => (
              <Box key={item.id} className="flex justify-between">
                <Typography variant="body2">
                  {item.quantity} × {locale === 'ar' ? item.nameAr : item.name}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Divider className="my-3" />
          
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <Box>
              <Typography variant="subtitle2" color="textSecondary" className="mb-1">
                {t('order.deliveryAddress')}:
              </Typography>
              <Typography variant="body2">
                {order.shippingAddress.recipient}
              </Typography>
              <Typography variant="body2">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary" className="mb-1">
                {t('order.paymentMethod')}:
              </Typography>
              <Typography variant="body2">
                {order.paymentMethod === 'cash' ? t('checkout.cashOnDelivery') : t('checkout.creditCard')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        
        <CardActions className="px-4 pb-4 pt-0 flex justify-end gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
            component={Link}
            href={`/orders/${order.id}`}
          >
            {t('order.viewDetails')}
          </Button>
          
          {order.status === 'delivered' && onReorder && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<ArrowUturnLeftIcon className="h-4 w-4" />}
              onClick={() => onReorder(order.id)}
            >
              {t('orders.reorder')}
            </Button>
          )}
          
          {(order.status === 'processing' || order.status === 'outForDelivery') && onTrack && (
            <Button
              variant="outlined"
              color="info"
              size="small"
              startIcon={<ClockIcon className="h-4 w-4" />}
              onClick={() => onTrack(order.id)}
            >
              {t('orders.track')}
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default OrderCard; 