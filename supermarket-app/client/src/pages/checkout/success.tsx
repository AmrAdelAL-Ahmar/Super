import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box
} from '@mui/material';
import { 
  CheckCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const CheckoutSuccessPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // Use state to store the order number and date
  const [orderNumber, setOrderNumber] = useState("ORD-000000");
  const [orderDate, setOrderDate] = useState("");
  
  // Generate order number and date only on client side to avoid hydration errors
  useEffect(() => {
    // Generate a random order number
    setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    // Set the current date
    setOrderDate(new Date().toLocaleDateString());
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
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
  
  return (
    <MainLayout>
      <Container maxWidth="md" className="py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <CheckCircleIcon className="h-24 w-24 mx-auto text-green-500 mb-6" />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography variant="h3" component="h1" className="font-bold mb-3">
              {t('checkout.successTitle')}
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography variant="h6" className="text-gray-600 mb-8">
              {t('checkout.successMessage')}
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Paper elevation={2} className="p-8 mb-8 max-w-md mx-auto">
              <Typography variant="h6" className="font-bold mb-6">
                {t('checkout.orderConfirmation')}
              </Typography>
              
              <Box className="flex justify-between mb-3">
                <Typography variant="body1" className="text-gray-600">
                  {t('checkout.orderNumber')}:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {orderNumber}
                </Typography>
              </Box>
              
              <Box className="flex justify-between mb-3">
                <Typography variant="body1" className="text-gray-600">
                  {t('order.date')}:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {orderDate}
                </Typography>
              </Box>
              
              <Box className="flex justify-between mb-3">
                <Typography variant="body1" className="text-gray-600">
                  {t('checkout.paymentMethod')}:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {t('checkout.cashOnDelivery')}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outlined"
              component={Link}
              href="/orders"
              startIcon={<ShoppingBagIcon className="h-5 w-5" />}
              size="large"
            >
              {t('order.trackOrder')}
            </Button>
            
            <Button
              variant="contained"
              component={Link}
              href="/"
              size="large"
              className="bg-primary-600 hover:bg-primary-700"
            >
              {t('checkout.backToHome')}
            </Button>
          </motion.div>
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

export default CheckoutSuccessPage; 