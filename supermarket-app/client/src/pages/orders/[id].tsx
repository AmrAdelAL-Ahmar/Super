import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Grid, Button, Box, Alert } from '@mui/material';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/layouts/MainLayout';
import OrderTracker from '@/components/orders/OrderTracker';
import OrderMap from '@/components/orders/OrderMap';
import OrderDetails from '@/components/orders/OrderDetails';
import { motion } from 'framer-motion';
import { Order, formatOrderDate, canCancelOrder } from '@/types/order';
import { getOrderById, cancelOrder, reorderItems } from '@/services/orderService';

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('common');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (id && typeof id === 'string') {
        setLoading(true);
        setError(null);
        
        try {
          const orderData = await getOrderById(id);
          if (orderData) {
            setOrder(orderData);
          } else {
            setError(t('order.notFound', 'Order not found'));
          }
          setLoading(false);
        } catch (err) {
          setError(t('order.errorLoading', 'Failed to load order details'));
          setLoading(false);
        }
      }
    };
    
    fetchOrder();
  }, [id, t]);
  
  const handleBackToOrders = () => {
    router.push('/orders');
  };
  
  const handleCancelOrder = async () => {
    if (!order) return;
    
    try {
      const success = await cancelOrder(order.id);
      if (success) {
        // Refresh order data
        const updatedOrder = await getOrderById(order.id);
        if (updatedOrder) {
          setOrder(updatedOrder);
        }
      }
    } catch (err) {
      setError(t('order.cancelError', 'Failed to cancel order'));
    }
  };
  
  const handleReorder = async () => {
    if (!order) return;
    
    try {
      const success = await reorderItems(order.id);
      if (success) {
        // Navigate to cart
        router.push('/cart');
      }
    } catch (err) {
      setError(t('order.reorderError', 'Failed to reorder items'));
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </Container>
      </MainLayout>
    );
  }
  
  if (error || !order) {
    return (
      <MainLayout>
        <Container maxWidth="lg" className="py-8">
          <Button
            startIcon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={handleBackToOrders}
            className="mb-4"
          >
            {t('order.backToOrders', 'Back to Orders')}
          </Button>
          <Alert severity="error" className="mt-4">
            {error || t('order.notFound', 'Order not found')}
          </Alert>
        </Container>
      </MainLayout>
    );
  }
  
  const isDelivering = order.status === 'outForDelivery';
  const formattedDate = formatOrderDate(order.date);
  const canCancel = canCancelOrder(order);
  
  // Mock location data (in a real app, this would come from the API)
  const locations = {
    customer: { lat: 40.7128, lng: -74.0060 }, // New York
    store: { lat: 40.7300, lng: -73.9950 }, // Store location
    driver: { lat: 40.7200, lng: -74.0000 } // Driver's current location
  };
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Button
              startIcon={<ArrowLeftIcon className="h-5 w-5" />}
              onClick={handleBackToOrders}
              className="mb-4"
            >
              {t('order.backToOrders', 'Back to Orders')}
            </Button>
            
            <Box className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {t('order.orderNumber', 'Order')}: {order.id}
              </h1>
            </Box>
          </motion.div>
          
          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            </motion.div>
          )}
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <OrderTracker 
                status={order.status}
                orderDate={formattedDate}
                timeline={order.timeline}
                className="mb-4"
              />
              
              {isDelivering && (
                <OrderMap 
                  customerLocation={locations.customer}
                  storeLocation={locations.store}
                  driverLocation={locations.driver}
                  isDelivering={isDelivering}
                  className="mb-4"
                />
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <OrderDetails 
                order={order}
                onCancelOrder={canCancel ? handleCancelOrder : undefined}
                onReorder={order.status !== 'pending' ? handleReorder : undefined}
              />
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default OrderDetailPage; 