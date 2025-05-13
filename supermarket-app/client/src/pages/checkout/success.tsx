import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';
import { Container } from '@mui/material';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import SuccessMessage from '@/components/checkout/SuccessMessage';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';
import ActionButtons from '@/components/checkout/ActionButtons';

const CheckoutSuccessPage = () => {
  const { t } = useTranslation('common');
  
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
  
  // Define action buttons
  const actionButtons = [
    {
      label: t('order.trackOrder'),
      href: '/orders',
      variant: 'outlined' as const,
      icon: <ShoppingBagIcon className="h-5 w-5" />
    },
    {
      label: t('checkout.backToHome'),
      href: '/',
      variant: 'contained' as const
    }
  ];
  
  return (
    <MainLayout>
      <Container maxWidth="md" className="py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessMessage 
            title={t('checkout.successTitle')}
            message={t('checkout.successMessage')||''}
          />
          
          <OrderConfirmation 
            orderNumber={orderNumber}
            orderDate={orderDate}
            paymentMethod={t('checkout.cashOnDelivery')}
            className="mb-8"
          />
          
          <ActionButtons buttons={actionButtons} />
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