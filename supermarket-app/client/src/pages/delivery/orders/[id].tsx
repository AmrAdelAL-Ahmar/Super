import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { 
  ArrowLeftIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  CameraIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { getDeliveryById, updateDeliveryStatus } from '@/services/deliveryService';

const DeliveryOrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('assigned');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => {
    // Fetch the delivery data when the id is available
    const fetchDelivery = async () => {
      if (id) {
        try {
          const deliveryData = await getDeliveryById(id as string);
          if (deliveryData) {
            setDelivery(deliveryData);
            setCurrentStatus(deliveryData.status);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching delivery:', error);
          setLoading(false);
        }
      }
    };
    
    fetchDelivery();
  }, [id]);
  
  const handleBack = () => {
    router.push('/delivery');
  };
  
  const handleCallCustomer = () => {
    if (delivery) {
      window.location.href = `tel:${delivery.customer.phone}`;
    }
  };
  
  const handleNavigate = () => {
    if (delivery) {
      // In a real app, this would open navigation to the customer's location
      // For now, we'll just navigate to the map page
      router.push(`/delivery/map?lat=${delivery.customer.location.lat}&lng=${delivery.customer.location.lng}`);
    }
  };
  
  const handleUpdateStatus = () => {
    setOpenConfirmDialog(true);
  };
  
  const handleConfirmStatusUpdate = async () => {
    if (!delivery) return;
    
    // Get the next status
    const nextStatus = getNextStatus(currentStatus);
    
    try {
      // Call API to update status
      const success = await updateDeliveryStatus(delivery.id, nextStatus);
      
      if (success) {
        setCurrentStatus(nextStatus);
        setOpenConfirmDialog(false);
        
        // If the status is now "delivered", show a success message and redirect after a delay
        if (nextStatus === 'delivered') {
          setTimeout(() => {
            router.push('/delivery');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };
  
  const handleCancelDelivery = () => {
    setOpenCancelDialog(true);
  };
  
  const handleConfirmCancel = async () => {
    if (!delivery) return;
    
    try {
      // Call API to cancel the delivery
      const success = await updateDeliveryStatus(delivery.id, 'cancelled');
      
      if (success) {
        setCurrentStatus('cancelled');
        setOpenCancelDialog(false);
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/delivery');
        }, 1500);
      }
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    }
  };
  
  const getNextStatus = (status: DeliveryStatus): DeliveryStatus => {
    switch (status) {
      case 'assigned': return 'accepted';
      case 'accepted': return 'picked_up';
      case 'picked_up': return 'on_the_way';
      case 'on_the_way': return 'delivered';
      default: return status;
    }
  };
  
  const getStatusLabel = (status: DeliveryStatus): string => {
    return t(`delivery.status.${status}`);
  };
  
  const getNextActionLabel = (status: DeliveryStatus): string => {
    switch (status) {
      case 'assigned': return t('delivery.actions.accept');
      case 'accepted': return t('delivery.actions.confirmPickup');
      case 'picked_up': return t('delivery.actions.startDelivery');
      case 'on_the_way': return t('delivery.actions.confirmDelivery');
      default: return '';
    }
  };
  
  const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString(router.locale, { hour: '2-digit', minute: '2-digit' });
  };
  
  // Define the delivery steps
  const steps = [
    {
      label: t('delivery.status.assigned'),
      description: delivery?.assignedAt ? formatTime(delivery.assignedAt) : '',
      completed: ['accepted', 'picked_up', 'on_the_way', 'delivered'].includes(currentStatus)
    },
    {
      label: t('delivery.status.accepted'),
      description: delivery?.acceptedAt ? formatTime(delivery.acceptedAt) : '',
      completed: ['picked_up', 'on_the_way', 'delivered'].includes(currentStatus)
    },
    {
      label: t('delivery.status.picked_up'),
      description: delivery?.pickedUpAt ? formatTime(delivery.pickedUpAt) : '',
      completed: ['on_the_way', 'delivered'].includes(currentStatus)
    },
    {
      label: t('delivery.status.on_the_way'),
      description: '',
      completed: ['delivered'].includes(currentStatus)
    },
    {
      label: t('delivery.status.delivered'),
      description: '',
      completed: ['delivered'].includes(currentStatus)
    }
  ];
  
  // Get the active step index
  const getActiveStep = (): number => {
    switch (currentStatus) {
      case 'assigned': return 0;
      case 'accepted': return 1;
      case 'picked_up': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };
  
  if (loading || !delivery) {
    return (
      <DeliveryLayout>
        <Container maxWidth="lg" className="py-8">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </DeliveryLayout>
    );
  }
  
  const activeStep = getActiveStep();
  const isCompleted = currentStatus === 'delivered';
  const isCancelled = currentStatus === 'cancelled';
  
  return (
    <DeliveryLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="flex items-center mb-6">
            <Button
              startIcon={<ArrowLeftIcon className="h-5 w-5" />}
              onClick={handleBack}
              className="mr-4"
            >
              {t('delivery.back')}
            </Button>
            <Typography variant="h5" component="h1" className="font-bold">
              {t('delivery.orderDetails')}
            </Typography>
          </Box>
          
          {isCancelled && (
            <Paper elevation={0} className="mb-6 p-4 bg-red-50 border border-red-200">
              <Box className="flex items-center">
                <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                <Typography variant="body1" className="text-red-700 font-medium">
                  {t('delivery.orderCancelled')}
                </Typography>
              </Box>
            </Paper>
          )}
          
          {isCompleted && (
            <Paper elevation={0} className="mb-6 p-4 bg-green-50 border border-green-200">
              <Box className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                <Typography variant="body1" className="text-green-700 font-medium">
                  {t('delivery.orderCompleted')}
                </Typography>
              </Box>
            </Paper>
          )}
          
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={7}>
              <Paper elevation={1} className="p-4 mb-6">
                <Typography variant="h6" className="font-medium mb-4">
                  {t('delivery.deliveryProgress')}
                </Typography>
                
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label} completed={step.completed}>
                      <StepLabel>
                        <Typography variant="subtitle1" className="font-medium">
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        {step.description && (
                          <Typography variant="body2" color="textSecondary">
                            {step.description}
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                
                {!isCompleted && !isCancelled && (
                  <Box className="mt-4 flex gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateStatus}
                      disabled={isCompleted||isCancelled }
                      startIcon={<CheckCircleIcon className="h-5 w-5" />}
                    >
                      {getNextActionLabel(currentStatus)}
                    </Button>
                    
                    {!isCompleted && !isCancelled && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancelDelivery}
                      >
                        {t('delivery.actions.cancel')}
                      </Button>
                    )}
                  </Box>
                )}
              </Paper>
              
              <Paper elevation={1} className="p-4">
                <Typography variant="h6" className="font-medium mb-4">
                  {t('delivery.orderItems')}
                </Typography>
                
                <List disablePadding>
                  {delivery.items.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem disablePadding className="py-2">
                        <ListItemText
                          primary={`${item.name} x${item.quantity}`}
                          secondary={item.price ? `$${item.price.toFixed(2)} each` : undefined}
                        />
                        {item.price && (
                          <Typography variant="body2" className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        )}
                      </ListItem>
                    </React.Fragment>
                  ))}
                  
                  {delivery.subtotal && delivery.deliveryFee && delivery.total && (
                    <>
                      <Divider className="my-2" />
                      
                      <Box className="pt-2">
                        <Box className="flex justify-between mb-1">
                          <Typography variant="body2">{t('order.subtotal')}</Typography>
                          <Typography variant="body2">${delivery.subtotal.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box className="flex justify-between mb-1">
                          <Typography variant="body2">{t('order.deliveryFee')}</Typography>
                          <Typography variant="body2">${delivery.deliveryFee.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box className="flex justify-between mt-2">
                          <Typography variant="subtitle1" className="font-bold">
                            {t('order.total')}
                          </Typography>
                          <Typography variant="subtitle1" className="font-bold">
                            ${delivery.total.toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Box className="mt-2 pt-2 border-t">
                          <Typography variant="body2" className="font-medium">
                            {t('order.paymentMethod')}: {delivery.paymentMethod}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </List>
              </Paper>
            </Grid>
            
            {/* Right Column */}
            <Grid item xs={12} md={5}>
              <Paper elevation={1} className="p-4 mb-6">
                <Typography variant="h6" className="font-medium mb-4">
                  {t('delivery.customerInfo')}
                </Typography>
                
                <Box className="mb-3">
                  <Typography variant="body2" color="textSecondary">
                    {t('delivery.name')}
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {delivery.customer.name}
                  </Typography>
                </Box>
                
                <Box className="mb-3">
                  <Typography variant="body2" color="textSecondary">
                    {t('delivery.phone')}
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {delivery.customer.phone}
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="body2" color="textSecondary">
                    {t('delivery.address')}
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {delivery.customer.address}
                  </Typography>
                </Box>
                
                <Box className="flex gap-2">
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon className="h-5 w-5" />}
                    onClick={handleCallCustomer}
                    fullWidth
                  >
                    {t('delivery.call')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<MapPinIcon className="h-5 w-5" />}
                    onClick={handleNavigate}
                    fullWidth
                  >
                    {t('delivery.navigate')}
                  </Button>
                </Box>
              </Paper>
              
              <Paper elevation={1} className="p-4">
                <Typography variant="h6" className="font-medium mb-4">
                  {t('delivery.pickupInfo')}
                </Typography>
                
                <Box className="mb-3">
                  <Typography variant="body2" color="textSecondary">
                    {t('delivery.storeName')}
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {delivery.store.name}
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="body2" color="textSecondary">
                    {t('delivery.storeAddress')}
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {delivery.store.address}
                  </Typography>
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<MapPinIcon className="h-5 w-5" />}
                  onClick={() => router.push(`/delivery/map?lat=${delivery.store.location.lat}&lng=${delivery.store.location.lng}`)}
                  fullWidth
                >
                  {t('delivery.navigateToStore')}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
        
        {/* Status Update Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>
            {t('delivery.confirmStatusUpdate')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('delivery.confirmStatusUpdateMessage', {
                status: getStatusLabel(getNextStatus(currentStatus))
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmStatusUpdate} color="primary" autoFocus>
              {t('common.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Cancel Delivery Dialog */}
        <Dialog
          open={openCancelDialog}
          onClose={() => setOpenCancelDialog(false)}
        >
          <DialogTitle>
            {t('delivery.confirmCancellation')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="mb-4">
              {t('delivery.confirmCancellationMessage')}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label={t('delivery.cancellationReason')}
              fullWidth
              variant="outlined"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCancelDialog(false)}>
              {t('common.back')}
            </Button>
            <Button onClick={handleConfirmCancel} color="error">
              {t('delivery.cancelDelivery')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DeliveryLayout>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default DeliveryOrderDetailPage; 