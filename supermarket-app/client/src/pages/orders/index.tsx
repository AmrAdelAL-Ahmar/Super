import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/layouts/MainLayout';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Order } from '@/types/order';
import { getUserOrders, reorderItems } from '@/services/orderService';
import OrderCard from '@/components/orders/OrderCard';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';

const OrdersPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle reorder
  const handleReorder = async (orderId: string) => {
    try {
      const success = await reorderItems(orderId);
      if (success) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  // Handle order tracking
  const handleTrackOrder = (orderId: string) => {
    router.push(`/orders/${orderId}#tracking`);
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
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
            <Typography variant="h4" component="h1" className="font-bold mb-6 text-center">
              {t('orders.title')}
            </Typography>
          </motion.div>
          
          {loading ? (
            <Box className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </Box>
          ) : (
            <>
              {orders.length > 0 ? (
                <Box className="space-y-6">
                  {orders.map((order) => (
                    <OrderCard 
                      key={order.id}
                      order={order}
                      onReorder={handleReorder}
                      onTrack={handleTrackOrder}
                    />
                  ))}
                </Box>
              ) : (
                <EmptyOrdersState />
              )}
            </>
          )}
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default OrdersPage; 