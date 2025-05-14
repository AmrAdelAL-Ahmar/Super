import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { getActiveDelivery, updateDeliveryStatus } from '@/services/deliveryService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ActiveDeliveryOrder() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const data = await getActiveDelivery();
        setDelivery(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [t]);

  const getStatusSteps = (): { label: string, completed: boolean, active: boolean }[] => {
    const steps = [
      { status: 'accepted', label: t('delivery.status.accepted') },
      { status: 'picked_up', label: t('delivery.status.picked_up') },
      { status: 'on_the_way', label: t('delivery.status.on_the_way') },
      { status: 'delivered', label: t('delivery.status.delivered') }
    ];

    const currentStatusIndex = steps.findIndex(step => step.status === delivery?.status);
    
    return steps.map((step, index) => ({
      label: step.label,
      completed: index < currentStatusIndex,
      active: index === currentStatusIndex
    }));
  };

  const getNextStatus = (): DeliveryStatus | null => {
    if (!delivery) return null;

    const statusFlow: DeliveryStatus[] = ['accepted', 'picked_up', 'on_the_way', 'delivered'];
    const currentIndex = statusFlow.indexOf(delivery.status);
    
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    
    return null;
  };

  const getActionButtonLabel = (): string => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return '';

    switch (nextStatus) {
      case 'picked_up':
        return t('delivery.actions.confirmPickup');
      case 'on_the_way':
        return t('delivery.actions.startDelivery');
      case 'delivered':
        return t('delivery.actions.confirmDelivery');
      default:
        return '';
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus();
    if (!delivery || !nextStatus) return;

    setUpdating(true);
    setError(null);
    
    try {
      const success = await updateDeliveryStatus(delivery.id, nextStatus);
      
      if (success) {
        setDelivery({
          ...delivery,
          status: nextStatus
        });
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);

        // If delivery is completed, redirect to dashboard after a delay
        if (nextStatus === 'delivered') {
          setTimeout(() => {
            router.push('/delivery');
          }, 2000);
        }
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleViewMap = () => {
    router.push('/delivery/map');
  };

  const handleCallCustomer = () => {
    if (delivery?.customer.phone) {
      window.location.href = `tel:${delivery.customer.phone}`;
    }
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </DeliveryLayout>
    );
  }

  if (!delivery) {
    return (
      <DeliveryLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="info">
            {t('delivery.noActiveDelivery')}
          </Alert>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => router.push('/delivery')}
          >
            {t('common.back')}
          </Button>
        </Box>
      </DeliveryLayout>
    );
  }

  const steps = getStatusSteps();
  const nextStatus = getNextStatus();
  const actionButtonLabel = getActionButtonLabel();

  return (
    <DeliveryLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {t('delivery.activeDelivery')}
          </Typography>
          <Chip 
            label={t(`delivery.status.${delivery.status}`)}
            color={delivery.status === 'delivered' ? 'success' : 'primary'}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('delivery.confirmStatusUpdate')}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('delivery.orderDetails')} - #{delivery.id}
          </Typography>
          
          <Stepper activeStep={steps.findIndex(step => step.active)} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={index} completed={step.completed}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HomeIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">
                      {t('delivery.customerInfo')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1">
                    <strong>{t('delivery.name')}:</strong> {delivery.customer.name}
                  </Typography>
                  
                  <Typography variant="body1">
                    <strong>{t('delivery.address')}:</strong> {delivery.customer.address}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      onClick={handleCallCustomer}
                      sx={{ mr: 1 }}
                    >
                      {t('delivery.call')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<MapIcon />}
                      onClick={handleViewMap}
                    >
                      {t('delivery.navigate')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StoreIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6">
                      {t('delivery.pickupInfo')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1">
                    <strong>{t('delivery.storeName')}:</strong> {delivery.store.name}
                  </Typography>
                  
                  <Typography variant="body1">
                    <strong>{t('delivery.storeAddress')}:</strong> {delivery.store.address}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<MapIcon />}
                      onClick={handleViewMap}
                    >
                      {t('delivery.navigateToStore')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            {t('delivery.orderItems')}
          </Typography>
          
          <List>
            {delivery.items.map((item, index) => (
              <ListItem key={index} divider={index < delivery.items.length - 1}>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.quantity} × ${item.price ? `$${item.price.toFixed(2)}` : ''}`}
                />
                {item.price && (
                  <Typography variant="body1">
                    ${(item.quantity * item.price).toFixed(2)}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">{t('order.subtotal')}:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">${delivery.subtotal?.toFixed(2)}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2">{t('order.deliveryFee')}:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">${delivery.deliveryFee?.toFixed(2)}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('order.total')}:
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${delivery.total?.toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {t('checkout.paymentMethod')}: {delivery.paymentMethod}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        {nextStatus && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/delivery')}
            >
              {t('common.back')}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={nextStatus === 'delivered' ? <CheckCircleIcon /> : <ShippingIcon />}
              onClick={handleStatusUpdate}
              disabled={updating}
            >
              {updating ? <CircularProgress size={24} /> : actionButtonLabel}
            </Button>
          </Box>
        )}
      </Box>
    </DeliveryLayout>
  );
} 
export async function getServerSideProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }
  