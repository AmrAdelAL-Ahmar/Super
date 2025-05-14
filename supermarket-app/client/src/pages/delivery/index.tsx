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
  Chip,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import ActiveDeliveryCard from '@/components/delivery/ActiveDeliveryCard';
import DeliveryOrdersList from '@/components/delivery/DeliveryOrdersList';
import DeliveryStats from '@/components/delivery/DeliveryStats';
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus';
import { getDeliveryPersonProfile, getActiveDelivery, getPendingOrders } from '@/services/deliveryService';
import { DeliveryPerson, Delivery, PendingOrder } from '@/types/delivery';

const DeliveryDashboardPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  
  const { status, setStatus } = useDeliveryStatus();
  
  useEffect(() => {
    // Fetch data from our services
    const fetchData = async () => {
      try {
        const [profileData, deliveryData, ordersData] = await Promise.all([
          getDeliveryPersonProfile(),
          getActiveDelivery(),
          getPendingOrders()
        ]);
        
        setDeliveryPerson(profileData);
        setActiveDelivery(deliveryData);
        setPendingOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'online' : 'offline';
    setStatus(newStatus);
  };
  
  const handleViewActiveDelivery = () => {
    if (activeDelivery) {
      router.push(`/delivery/orders/${activeDelivery.id}`);
    }
  };
  
  if (loading) {
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
  
  return (
    <DeliveryLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Bar */}
          <Paper elevation={1} className="p-4 mb-6">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Typography variant="h6" component="h1" className="mr-4">
                  {t('delivery.welcome', { name: deliveryPerson?.name })}
                </Typography>
                <Chip
                  label={status === 'online' ? t('delivery.status.online') : t('delivery.status.offline')}
                  color={status === 'online' ? 'success' : 'default'}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={status === 'online'}
                    onChange={handleStatusChange}
                    color="success"
                  />
                }
                label={t('delivery.goOnline')}
              />
            </Box>
          </Paper>
          
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              {/* Active Delivery */}
              {activeDelivery && status === 'online' ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Paper elevation={1} className="p-4 mb-6">
                    <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
                      <Typography variant="h6" component="h2">
                        {t('delivery.activeDelivery')}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleViewActiveDelivery}
                      >
                        {t('delivery.viewDetails')}
                      </Button>
                    </Box>
                    <ActiveDeliveryCard delivery={activeDelivery} />
                  </Paper>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Paper elevation={1} className="p-6 mb-6 text-center">
                    <Box className="flex flex-col items-center justify-center py-8">
                      <TruckIcon className="h-16 w-16 text-gray-400 mb-4" />
                      <Typography variant="h6" component="h2" className="mb-2">
                        {status === 'online' 
                          ? t('delivery.noActiveDelivery') 
                          : t('delivery.goOnlineToSeeDeliveries')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="mb-4">
                        {status === 'online' 
                          ? t('delivery.waitingForAssignment') 
                          : t('delivery.youreCurrentlyOffline')}
                      </Typography>
                      {status === 'offline' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setStatus('online')}
                        >
                          {t('delivery.goOnline')}
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              )}
              
              {/* Pending Orders */}
              {status === 'online' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Paper elevation={1} className="p-4">
                    <Typography variant="h6" component="h2" className="mb-4">
                      {t('delivery.pendingOrders')}
                    </Typography>
                    <DeliveryOrdersList orders={pendingOrders} />
                  </Paper>
                </motion.div>
              )}
            </Grid>
            
            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Delivery Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Paper elevation={1} className="p-4 mb-6">
                  <Typography variant="h6" component="h2" className="mb-4">
                    {t('delivery.yourStats')}
                  </Typography>
                  {deliveryPerson && (
                    <DeliveryStats
                      ratings={deliveryPerson.ratings}
                      totalDeliveries={deliveryPerson.totalDeliveries}
                      completedToday={deliveryPerson.completedToday}
                      earnings={deliveryPerson.earnings}
                    />
                  )}
                </Paper>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Paper elevation={1} className="p-4">
                  <Typography variant="h6" component="h2" className="mb-4">
                    {t('delivery.quickActions')}
                  </Typography>
                  <Box className="flex flex-col space-y-2">
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MapPinIcon className="h-5 w-5" />}
                      onClick={() => router.push('/delivery/map')}
                    >
                      {t('delivery.openMap')}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ClockIcon className="h-5 w-5" />}
                      onClick={() => router.push('/delivery/history')}
                    >
                      {t('delivery.deliveryHistory')}
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<StarIcon className="h-5 w-5" />}
                      onClick={() => router.push('/delivery/ratings')}
                    >
                      {t('delivery.viewRatings')}
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
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

export default DeliveryDashboardPage; 