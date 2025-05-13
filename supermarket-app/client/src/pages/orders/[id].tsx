import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Breadcrumbs,
  Grid
} from '@mui/material';
import { 
  ChevronLeftIcon,
  ShoppingCartIcon,
  ArrowUturnLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Order } from '@/types/order';
import { getOrderById, reorderItems, getUserOrders } from '@/services/orderService';
import OrderStatusDisplay from '@/components/orders/OrderStatusDisplay';
import OrderStepper from '@/components/orders/OrderStepper';
import OrderItemsList from '@/components/orders/OrderItemsList';
import OrderTimeline from '@/components/orders/OrderTimeline';
import OrderSummary from '@/components/orders/OrderSummary';
import AddressCard from '@/components/orders/AddressCard';
import PaymentMethodCard from '@/components/orders/PaymentMethodCard';

const OrderDetailPage = ({ order }: { order: Order }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Handle reordering
  const handleReorder = async () => {
    try {
      const success = await reorderItems(order.id);
      if (success) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to reorder:', error);
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
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Handle loading/fallback state
  if (router.isFallback || !order) {
    return (
      <MainLayout>
        <Container maxWidth="lg" className="py-12">
          <Box className="flex justify-center items-center min-h-[400px]">
            <ClockIcon className="h-12 w-12 text-primary-500 animate-spin" />
          </Box>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Breadcrumbs */}
          <motion.div variants={itemVariants} className="mb-6">
            <Breadcrumbs separator={locale === 'ar' ? '←' : '→'} aria-label="breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-primary-600">
                {t('navigation.home')}
              </Link>
              <Link href="/orders" className="text-gray-500 hover:text-primary-600">
                {t('orders.title')}
              </Link>
              <Typography color="text.primary">
                {order.id}
              </Typography>
            </Breadcrumbs>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <Box className="flex items-center">
              <Button
                variant="outlined"
                startIcon={<ChevronLeftIcon className="h-5 w-5" />}
                onClick={() => router.push('/orders')}
                className="mr-4"
              >
                {t('common.back')}
              </Button>
              
              <Typography variant="h4" component="h1" className="font-bold">
                {t('order.orderDetails')}
              </Typography>
            </Box>
            
            <OrderStatusDisplay status={order.status} />
          </motion.div>
          
          {/* Order Stepper */}
          <motion.div variants={itemVariants} className="mb-8">
            <OrderStepper status={order.status} />
          </motion.div>
          
          <Grid container spacing={4}>
            {/* Order Details & Timeline */}
            <Grid item xs={12} md={8}>
              {/* Order Items */}
              <motion.div variants={itemVariants} className="mb-6">
                <OrderItemsList items={order.items} />
              </motion.div>
              
              {/* Order Timeline */}
              <motion.div variants={itemVariants}>
                <OrderTimeline timeline={order.timeline} />
              </motion.div>
            </Grid>
            
            {/* Order Summary & Address */}
            <Grid item xs={12} md={4}>
              {/* Order Summary */}
              <motion.div variants={itemVariants}>
                <OrderSummary 
                  subtotal={order.subtotal}
                  shippingCost={order.shippingCost}
                  discount={order.discount}
                  total={order.total}
                  className="mb-6"
                />
              </motion.div>
              
              {/* Shipping Address */}
              <motion.div variants={itemVariants}>
                <AddressCard 
                  address={order.shippingAddress} 
                  className="mb-6"
                />
              </motion.div>
              
              {/* Payment Method */}
              <motion.div variants={itemVariants}>
                <PaymentMethodCard 
                  method={order.paymentMethod} 
                  className="mb-6"
                />
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                {order.status === 'delivered' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowUturnLeftIcon className="h-5 w-5" />}
                    fullWidth
                    className="mb-3 bg-primary-600 hover:bg-primary-700"
                    onClick={handleReorder}
                  >
                    {t('order.orderAgain')}
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon className="h-5 w-5" />}
                  fullWidth
                  onClick={() => router.push('/products')}
                >
                  {t('cart.continueShopping')}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all orders for static path generation
  const orders = await getUserOrders();
  
  // Generate paths for all orders in both languages
  const paths = orders.flatMap(order => [
    { params: { id: order.id }, locale: 'en' },
    { params: { id: order.id }, locale: 'ar' }
  ]);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  // Find the order with the specified ID
  const order = await getOrderById(params?.id as string);

  if (!order) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      order,
    },
    revalidate: 60, // Revalidate every minute
  };
};

export default OrderDetailPage; 