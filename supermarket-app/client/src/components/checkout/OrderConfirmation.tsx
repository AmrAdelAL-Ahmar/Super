import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { TFunction } from 'next-i18next';

interface OrderConfirmationProps {
  orderNumber: string;
  orderDate: string;
  paymentMethod: string | ReturnType<TFunction>;
  className?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  orderDate,
  paymentMethod,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper elevation={2} className={`p-8 max-w-md mx-auto ${className}`}>
        <Typography variant="h6" className="font-bold mb-6">
          {t('checkout.orderConfirmation')}
        </Typography>
        
        <Box className="flex justify-between mb-3">
          <Typography variant="body1" className="text-gray-600">
            {t('checkout.orderNumber')}:
          </Typography>
          <Typography variant="body1" className="font-medium">
            {orderNumber}
          </Typography>
        </Box>
        
        <Box className="flex justify-between mb-3">
          <Typography variant="body1" className="text-gray-600">
            {t('order.date')}:
          </Typography>
          <Typography variant="body1" className="font-medium">
            {orderDate}
          </Typography>
        </Box>
        
        <Box className="flex justify-between mb-3">
          <Typography variant="body1" className="text-gray-600">
            {t('checkout.paymentMethod')}:
          </Typography>
          <Typography variant="body1" className="font-medium">
            {paymentMethod}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default OrderConfirmation; 