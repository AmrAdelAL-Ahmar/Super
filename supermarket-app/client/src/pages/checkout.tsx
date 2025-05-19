import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart, CartItem as CartSliceItem } from '@/features/cart/cartSlice';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button
} from '@mui/material';
import { motion } from 'framer-motion';

// Components
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import AddressSelection from '@/components/checkout/AddressSelection';
import PaymentMethodSelection from '@/components/checkout/PaymentMethodSelection';
import OrderReview from '@/components/checkout/OrderReview';
import CheckoutItemsList from '@/components/checkout/CheckoutItemsList';
import OrderSummary from '@/components/cart/OrderSummary';

// Services and Types
import checkoutService, { Address } from '@/services/checkoutService';
import { CartItem } from '@/types/cart';

const CheckoutPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    recipient: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shipping cost
  const shippingCost = 5.99;
  
  // Load user addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const userAddresses = await checkoutService.getUserAddresses();
        setAddresses(userAddresses);
        
        // Set default address if available
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        if (defaultAddress && defaultAddress.id) {
          setSelectedAddress(defaultAddress.id);
        } else if (userAddresses.length > 0 && userAddresses[0].id) {
          setSelectedAddress(userAddresses[0].id);
        }
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    };
    
    loadAddresses();
  }, []);
  
  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);
  
  // Steps labels
  const steps = [
    t('checkout.shippingAddress'),
    t('checkout.paymentMethod'),
    t('checkout.reviewOrder')
  ];
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle new address change
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };
  
  // Handle address selection
  const handleAddressSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsNewAddress(true);
    } else {
      setIsNewAddress(false);
      setSelectedAddress(value);
    }
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  // Handle order notes change
  const handleOrderNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderNotes(e.target.value);
  };
  
  // Handle set default address
  const handleSetDefaultAddress = (isDefault: boolean) => {
    setNewAddress({
      ...newAddress,
      isDefault
    });
  };
  
  // Handle agree to terms change
  const handleAgreeToTerms = (agreed: boolean) => {
    setAgreedToTerms(agreed);
  };
  
  // Convert cart items to the format expected by the checkout service
  const convertCartItems = (cartItems: CartSliceItem[]): CartItem[] => {
    return cartItems.map(item => ({
      ...item,
      category: '',
      inStock: true
    }));
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (!agreedToTerms) return;
    
    setIsLoading(true);
    
    try {
      // Save new address if needed
      let orderAddress = addressData;
      
      if (isNewAddress) {
        const savedAddress = await checkoutService.saveAddress(newAddress);
        orderAddress = savedAddress;
      }
      
      if (!orderAddress) {
        console.error('No address selected');
        setIsLoading(false);
        return;
      }
      
      // Place the order
      const orderData = {
        items: convertCartItems(items),
        address: orderAddress,
        paymentMethod,
        orderNotes: orderNotes || undefined,
        subtotal: totalAmount,
        shippingCost,
        total: totalAmount + shippingCost
      };
      
      const result = await checkoutService.placeOrder(orderData);
      
      if (result.success) {
        // Clear the cart
        dispatch(clearCart());
        
        // Navigate to success page
        router.push('/checkout/success');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get selected address data
  const addressData = addresses.find(addr => addr.id === selectedAddress);
  
  // Current address for review
  const currentAddress = isNewAddress ? newAddress : addressData;
  
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
  
  // Check if we can proceed to next step
  const canProceedToNextStep = () => {
    if (activeStep === 0) {
      if (isNewAddress) {
        return newAddress.recipient && newAddress.street && newAddress.city && newAddress.phone;
      }
      return !!addressData;
    }
    return true;
  };
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
              {t('checkout.title')}
            </Typography>
          </motion.div>
          
          <CheckoutStepper steps={steps} activeStep={activeStep} className="mb-8" />
          
          <motion.div variants={itemVariants} className="mt-8">
            <Grid container spacing={4}>
              {/* Checkout Steps */}
              <Grid item xs={12} md={8}>
                <Paper elevation={2} className="p-6">
                  {/* Step 1: Shipping Address */}
                  {activeStep === 0 && (
                    <>
                      <AddressSelection 
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        isNewAddress={isNewAddress}
                        newAddress={newAddress}
                        onAddressSelection={handleAddressSelection}
                        onNewAddressChange={handleNewAddressChange}
                        onSetDefaultAddress={handleSetDefaultAddress}
                      />
                      
                      <Box className="flex justify-end mt-6">
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          disabled={!canProceedToNextStep()}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {t('common.next')}
                        </Button>
                      </Box>
                    </>
                  )}
                  
                  {/* Step 2: Payment Method */}
                  {activeStep === 1 && (
                    <>
                      <PaymentMethodSelection 
                        paymentMethod={paymentMethod}
                        orderNotes={orderNotes}
                        onPaymentMethodChange={handlePaymentMethodChange}
                        onOrderNotesChange={handleOrderNotesChange}
                      />
                      
                      <Box className="flex justify-between mt-6">
                        <Button
                          variant="outlined"
                          onClick={handleBack}
                        >
                          {t('common.back')}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {t('common.next')}
                        </Button>
                      </Box>
                    </>
                  )}
                  
                  {/* Step 3: Review Order */}
                  {activeStep === 2 && currentAddress && (
                    <>
                      <OrderReview 
                        address={currentAddress}
                        paymentMethod={paymentMethod}
                        orderNotes={orderNotes || undefined}
                        agreedToTerms={agreedToTerms}
                        onAgreeChange={handleAgreeToTerms}
                      />
                      
                      <Box className="flex justify-between mt-6">
                        <Button
                          variant="outlined"
                          onClick={handleBack}
                        >
                          {t('common.back')}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handlePlaceOrder}
                          disabled={!agreedToTerms || isLoading}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {isLoading ? t('common.processing') : t('checkout.placeOrder')}
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
              
              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <div className="sticky top-24">
                  <Paper elevation={2} className="p-4">
                    <Typography variant="h5" className="font-bold mb-4">
                      {t('cart.orderSummary')}
                    </Typography>
                    
                    <CheckoutItemsList items={convertCartItems(items)} />
                    
                    <OrderSummary 
                      subtotal={totalAmount}
                      shippingCost={shippingCost}
                    />
                  </Paper>
                </div>
              </Grid>
            </Grid>
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

export default CheckoutPage;