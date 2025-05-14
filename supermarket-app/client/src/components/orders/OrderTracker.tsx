import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Typography, 
  Paper,
  StepContent,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  TruckIcon, 
  ShoppingBagIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { OrderStatus, TimelineEvent } from '@/types/order';

interface OrderTrackerProps {
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  timeline?: TimelineEvent[];
  className?: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({
  status,
  orderDate,
  estimatedDelivery,
  actualDelivery,
  timeline,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const isRTL = locale === 'ar';
  
  // Find delivery date from timeline if available
  const getDeliveryDate = (): string | undefined => {
    if (actualDelivery) return actualDelivery;
    if (!timeline) return undefined;
    
    const deliveryEvent = timeline.find(event => event.status === 'delivered');
    return deliveryEvent ? new Date(deliveryEvent.date).toLocaleDateString() : undefined;
  };
  
  // Define the steps based on the current status
  const getSteps = () => [
    {
      label: t('order.status.pending', 'Pending'),
      description: t('order.statusDescription.pending', 'Order has been placed'),
      icon: <ClockIcon className="h-6 w-6" />,
      completed: ['pending', 'confirmed', 'processing', 'outForDelivery', 'delivered'].includes(status)
    },
    {
      label: t('order.status.confirmed', 'Confirmed'),
      description: t('order.statusDescription.confirmed', 'Order has been confirmed'),
      icon: <CheckIcon className="h-6 w-6" />,
      completed: ['confirmed', 'processing', 'outForDelivery', 'delivered'].includes(status)
    },
    {
      label: t('order.status.processing', 'Processing'),
      description: t('order.statusDescription.processing', 'Order is being prepared'),
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      completed: ['processing', 'outForDelivery', 'delivered'].includes(status)
    },
    {
      label: t('order.status.outForDelivery', 'Out for Delivery'),
      description: t('order.statusDescription.outForDelivery', 'Order is out for delivery'),
      icon: <TruckIcon className="h-6 w-6" />,
      completed: ['outForDelivery', 'delivered'].includes(status)
    },
    {
      label: t('order.status.delivered', 'Delivered'),
      description: getDeliveryDate()
        ? t('order.deliveredAt', 'Delivered on {{date}}', { date: getDeliveryDate() })
        : t('order.statusDescription.delivered', 'Order has been delivered'),
      icon: <CheckIcon className="h-6 w-6" />,
      completed: ['delivered'].includes(status)
    }
  ];
  
  // Get the active step index
  const getActiveStep = () => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'outForDelivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };
  
  const steps = getSteps();
  const activeStep = getActiveStep();
  
  // If order is cancelled, show a different UI
  if (status === 'cancelled') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Paper elevation={0} className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <Box className="flex flex-col items-center">
            <Chip 
              label={t('order.status.cancelled', 'Cancelled')} 
              color="error" 
              className="mb-2"
            />
            <Typography variant="body1" className="text-center text-gray-700">
              {t('order.cancelledDescription', 'This order has been cancelled')}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Paper elevation={1} className="p-4">
        <Box className="mb-4 flex justify-between items-center">
          <Typography variant="h6" className="font-medium">
            {t('order.trackYourOrder', 'Track Your Order')}
          </Typography>
          <Chip 
            label={t(`order.status.${status}`, status)} 
            color={status === 'delivered' ? 'success' : 'primary'} 
            variant="outlined"
          />
        </Box>
        
        <Stepper activeStep={activeStep} orientation="vertical" className={isRTL ? 'rtl-stepper' : ''}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={step.completed}>
              <StepLabel
                StepIconComponent={() => (
                  <Box className={`p-1 rounded-full ${step.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                    {step.icon}
                  </Box>
                )}
              >
                <Typography variant="subtitle1" className="font-medium">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="textSecondary" className="mb-2">
                  {step.description}
                </Typography>
                {index === 3 && estimatedDelivery && (
                  <Typography variant="body2" className="text-primary-600 font-medium">
                    {t('order.estimatedDelivery', 'Estimated Delivery')}: {estimatedDelivery}
                  </Typography>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        <Box className="mt-4 pt-4 border-t">
          <Typography variant="body2" color="textSecondary">
            {t('order.orderedOn', 'Ordered on')}: {orderDate}
          </Typography>
          {estimatedDelivery && status !== 'delivered' && (
            <Typography variant="body2" color="textSecondary">
              {t('order.estimatedDelivery', 'Estimated Delivery')}: {estimatedDelivery}
            </Typography>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default OrderTracker; 