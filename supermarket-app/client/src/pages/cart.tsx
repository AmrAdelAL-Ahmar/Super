import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateQuantity, removeItem, clearCart } from '@/features/cart/cartSlice';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid
} from '@mui/material';
import { 
  ArrowLeftIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Import components
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyCart from '@/components/cart/EmptyCart';

const CartPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Shipping cost
  const shippingCost = totalAmount > 0 ? 5.99 : 0;
  
  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };
  
  // Handle item removal
  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };
  
  // Handle coupon application
  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    
    // Simple coupon validation
    if (code.toLowerCase() === 'discount10') {
      setDiscount(totalAmount * 0.1);
    } else if (code.toLowerCase() === 'freeshipping') {
      setDiscount(shippingCost);
    } else {
      setCouponError(t('cart.invalidCoupon')||"");
      setDiscount(0);
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    router.push('/checkout');
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
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h4" 
              component="h1" 
              className="text-center font-bold text-gray-800 mb-8"
            >
              {t('cart.title')}
            </Typography>
          </motion.div>
          
          {items.length > 0 ? (
            <Grid container spacing={4}>
              {/* Cart Items */}
              <Grid item xs={12} md={8}>
                <motion.div variants={itemVariants}>
                  <Paper elevation={2} className="p-4 mb-4">
                    {items.map((item, index) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        nameAr={item.nameAr}
                        price={item.price}
                        quantity={item.quantity}
                        image={item.image}
                        unit={item.unit}
                        stock={item.stock}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        isLast={index === items.length - 1}
                      />
                    ))}
                  </Paper>
                  
                  <Box className="flex justify-between">
                    <Button
                      variant="outlined"
                      startIcon={<ArrowLeftIcon className="h-4 w-4" />}
                      onClick={() => router.push('/products')}
                    >
                      {t('cart.continueShopping')}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<TrashIcon className="h-4 w-4" />}
                      onClick={() => dispatch(clearCart())}
                    >
                      {t('cart.clearCart')}
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
              
              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <OrderSummary
                  subtotal={totalAmount}
                  shippingCost={shippingCost}
                  discount={discount}
                  onApplyCoupon={handleApplyCoupon}
                  couponError={couponError}
                  onCheckout={handleCheckout}
                />
              </Grid>
            </Grid>
          ) : (
            <EmptyCart />
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

export default CartPage; 