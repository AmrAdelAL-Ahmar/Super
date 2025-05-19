import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  TextField, 
  Paper 
} from '@mui/material';
import { motion } from 'framer-motion';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  discount?: number;
  onApplyCoupon?: (code: string) => void;
  couponError?: string;
  onCheckout?: () => void;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCost,
  discount = 0,
  onApplyCoupon,
  couponError,
  onCheckout,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate total
  const total = subtotal + shippingCost - discount;
  
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.div variants={itemVariants}>
      <Paper elevation={2} className={`p-4 ${className}`}>
        <Typography variant="h5" className="font-bold mb-4">
          {t('cart.orderSummary')}
        </Typography>
        
        <Box className="flex justify-between mb-2">
          <Typography>{t('cart.subtotal')}</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>
        
        <Box className="flex justify-between mb-2">
          <Typography>{t('cart.shipping')}</Typography>
          <Typography>${shippingCost.toFixed(2)}</Typography>
        </Box>
        
        {discount > 0 && (
          <Box className="flex justify-between mb-2 text-green-600">
            <Typography>{t('cart.discount')}</Typography>
            <Typography>-${discount.toFixed(2)}</Typography>
          </Box>
        )}
        
        <Divider className="my-3" />
        
        <Box className="flex justify-between mb-4">
          <Typography variant="h6" className="font-bold">
            {t('cart.total')}
          </Typography>
          <Typography variant="h6" className="font-bold">
            ${total.toFixed(2)}
          </Typography>
        </Box>
        
        {onApplyCoupon && (
          <Box className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              {t('cart.couponCode')}
            </Typography>
            
            <Box className="flex">
              <TextField
                size="small"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={t('cart.enterCoupon')||""}
                fullWidth
                className="mr-2"
                error={!!couponError}
              />
              
              <Button 
                variant="outlined" 
                onClick={() => onApplyCoupon(couponCode)}
                disabled={!couponCode}
              >
                {t('cart.apply')}
              </Button>
            </Box>
            
            {couponError && (
              <Typography variant="caption" color="error" className="mt-1">
                {couponError}
              </Typography>
            )}
            
            <Typography variant="caption" className="mt-2 block text-gray-500">
              {t('cart.tryCoupon')}: DISCOUNT10, FREESHIPPING
            </Typography>
          </Box>
        )}
        
        {onCheckout && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={onCheckout}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {t('cart.proceedToCheckout')}
          </Button>
        )}
      </Paper>
    </motion.div>
  );
};

export default OrderSummary; 