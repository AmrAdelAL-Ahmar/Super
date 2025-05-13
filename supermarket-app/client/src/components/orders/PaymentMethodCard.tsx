import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

interface PaymentMethodCardProps {
  method: 'cash' | 'card';
  className?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  return (
    <Card variant="outlined" className={className}>
      <Box className="p-4 border-b flex items-center">
        <CreditCardIcon className="h-5 w-5 mr-2 text-primary-600" />
        <Typography variant="h6" className="font-bold">
          {t('order.paymentMethod')}
        </Typography>
      </Box>
      
      <CardContent>
        <Typography variant="body1">
          {method === 'cash' ? t('checkout.cashOnDelivery') : t('checkout.creditCard')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard; 