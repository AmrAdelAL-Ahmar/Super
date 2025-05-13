import React from 'react';
import { Paper, Stepper, Step, StepLabel } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { OrderStatus } from '@/types/order';
import { getStatusStep } from '@/utils/orderUtils';

interface OrderStepperProps {
  status: OrderStatus;
  className?: string;
}

const OrderStepper: React.FC<OrderStepperProps> = ({
  status,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const activeStep = getStatusStep(status);
  
  if (status === 'cancelled') {
    return null;
  }
  
  return (
    <Paper elevation={1} className={`p-4 ${className}`}>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step>
          <StepLabel>{t('orders.pending')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('orders.confirmed')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('orders.preparing')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('orders.outForDelivery')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('orders.delivered')}</StepLabel>
        </Step>
      </Stepper>
    </Paper>
  );
};

export default OrderStepper; 