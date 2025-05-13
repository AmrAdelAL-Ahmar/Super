import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  IconButton, 
  Paper, 
  Divider,
  TextField,
  Grid,
  Card,
  CardMedia,
  Alert,
} from '@mui/material';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  ShoppingCartIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
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
  const handleApplyCoupon = () => {
    setCouponError('');
    
    // Simple coupon validation
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(totalAmount * 0.1);
    } else if (couponCode.toLowerCase() === 'freeshipping') {
      setDiscount(shippingCost);
    } else {
      setCouponError(t('cart.invalidCoupon')||"");
      setDiscount(0);
    }
  };
  
  // Motion variants
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
                    {items.map((item) => (
                      <Box key={item.id} className="mb-4">
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3} sm={2}>
                            <Card className="h-24 w-24 overflow-hidden">
                              <CardMedia
                                component="img"
                                image={item.image}
                                alt={locale === 'ar' ? item.nameAr : item.name}
                                className="h-full w-full object-cover"
                              />
                            </Card>
                          </Grid>
                          
                          <Grid item xs={9} sm={4}>
                            <Typography variant="h6" className="text-gray-800">
                              {locale === 'ar' ? item.nameAr : item.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ${item.price.toFixed(2)} / {item.unit}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <Box className="flex items-center">
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </IconButton>
                              
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value)) {
                                    handleQuantityChange(item.id, value);
                                  }
                                }}
                                inputProps={{ min: 1, max: item.stock }}
                                size="small"
                                className="w-16 mx-2"
                              />
                              
                              <IconButton 
                                size="small" 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </IconButton>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={4} sm={2} className="text-right">
                            <Typography variant="h6" className="text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={2} sm={1} className="text-right">
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </IconButton>
                          </Grid>
                        </Grid>
                        
                        {/* Divider after each item except the last one */}
                        {items.indexOf(item) !== items.length - 1 && (
                          <Divider className="my-4" />
                        )}
                      </Box>
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
                <motion.div variants={itemVariants}>
                  <Paper elevation={2} className="p-4">
                    <Typography variant="h5" className="font-bold mb-4">
                      {t('cart.orderSummary')}
                    </Typography>
                    
                    <Box className="flex justify-between mb-2">
                      <Typography>{t('cart.subtotal')}</Typography>
                      <Typography>${totalAmount.toFixed(2)}</Typography>
                    </Box>
                    
                    <Box className="flex justify-between mb-2">
                      <Typography>{t('cart.shipping')}</Typography>
                      <Typography>${shippingCost.toFixed(2)}</Typography>
                    </Box>
                    
                    {discount > 0 && (
                      <Box className="flex justify-between mb-2 text-green-600">
                        <Typography>{t('cart.discount')}</Typography>
                        <Typography>-${discount.toFixed(2)}</Typography>
                      </Box>
                    )}
                    
                    <Divider className="my-3" />
                    
                    <Box className="flex justify-between mb-4">
                      <Typography variant="h6" className="font-bold">
                        {t('cart.total')}
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        ${(totalAmount + shippingCost - discount).toFixed(2)}
                      </Typography>
                    </Box>
                    
                    {/* Coupon code */}
                    <Box className="mb-4">
                      <Typography variant="subtitle2" className="mb-2">
                        {t('cart.couponCode')}
                      </Typography>
                      
                      <Box className="flex">
                        <TextField
                          size="small"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder={t('cart.enterCoupon')||""}
                          fullWidth
                          className="mr-2"
                          error={!!couponError}
                        />
                        
                        <Button 
                          variant="outlined" 
                          onClick={handleApplyCoupon}
                          disabled={!couponCode}
                        >
                          {t('cart.apply')}
                        </Button>
                      </Box>
                      
                      {couponError && (
                        <Typography variant="caption" color="error" className="mt-1">
                          {couponError}
                        </Typography>
                      )}
                      
                      <Typography variant="caption" className="mt-2 block text-gray-500">
                        {t('cart.tryCoupon')}: DISCOUNT10, FREESHIPPING
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={() => router.push('/checkout')}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {t('cart.proceedToCheckout')}
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          ) : (
            <motion.div variants={itemVariants}>
              <Paper elevation={2} className="p-8 text-center">
                <Box className="flex justify-center mb-4">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-400" />
                </Box>
                
                <Typography variant="h5" className="mb-2">
                  {t('cart.empty')}
                </Typography>
                
                <Typography variant="body1" color="textSecondary" className="mb-6">
                  {t('cart.emptyMessage')}
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/products')}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {t('cart.startShopping')}
                </Button>
              </Paper>
            </motion.div>
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