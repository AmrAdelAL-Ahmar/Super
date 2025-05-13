import React from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCost,
  discount,
  total,
  className = '',
}) => {
  const { t } = useTranslation('common');

  return (
    <Card variant="outlined" className={className}>
      <Box className="p-4 border-b">
        <Typography variant="h6" className="font-bold">
          {t('order.orderSummary')}
        </Typography>
      </Box>
      
      <CardContent>
        <Box className="space-y-2">
          <Box className="flex justify-between">
            <Typography variant="body1">{t('cart.subtotal')}</Typography>
            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
          </Box>
          
          <Box className="flex justify-between">
            <Typography variant="body1">{t('cart.shipping')}</Typography>
            <Typography variant="body1">${shippingCost.toFixed(2)}</Typography>
          </Box>
          
          {discount > 0 && (
            <Box className="flex justify-between text-green-600">
              <Typography variant="body1">{t('cart.discount')}</Typography>
              <Typography variant="body1">-${discount.toFixed(2)}</Typography>
            </Box>
          )}
          
          <Divider className="my-2" />
          
          <Box className="flex justify-between font-bold">
            <Typography variant="body1">{t('cart.total')}</Typography>
            <Typography variant="body1">${total.toFixed(2)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderSummary; 