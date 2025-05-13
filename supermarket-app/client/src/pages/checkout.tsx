import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/features/cart/cartSlice';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Divider, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Card,
  CardContent,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  Checkbox
} from '@mui/material';
import { motion } from 'framer-motion';

// Mock addresses
const MOCK_ADDRESSES = [
  {
    id: '1',
    name: 'Home',
    nameAr: 'المنزل',
    recipient: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '555-123-4567',
    isDefault: true
  },
  {
    id: '2',
    name: 'Work',
    nameAr: 'العمل',
    recipient: 'John Doe',
    street: '456 Office Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    phone: '555-987-6543',
    isDefault: false
  }
];

const CheckoutPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const dispatch = useDispatch();
  const { direction } = useSelector((state: RootState) => state.ui);
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    recipient: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  });
  
  // Shipping cost
  const shippingCost = 5.99;
  
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
  
  // Handle place order
  const handlePlaceOrder = () => {
    // In a real app, this would send an API request to create the order
    
    // Clear the cart
    dispatch(clearCart());
    
    // Navigate to success page (for now just redirect to home)
    router.push('/checkout/success');
  };
  
  // Get selected address data
  const addressData = MOCK_ADDRESSES.find(addr => addr.id === selectedAddress);
  
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
          className="mb-8"
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
              {t('checkout.title')}
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8">
            <Grid container spacing={4}>
              {/* Checkout Steps */}
              <Grid item xs={12} md={8}>
                <Paper elevation={2} className="p-6">
                  {/* Step 1: Shipping Address */}
                  {activeStep === 0 && (
                    <div>
                      <Typography variant="h5" className="mb-4">
                        {t('checkout.shippingAddress')}
                      </Typography>
                      
                      <RadioGroup
                        value={isNewAddress ? 'new' : selectedAddress}
                        onChange={handleAddressSelection}
                      >
                        {MOCK_ADDRESSES.map((address) => (
                          <FormControlLabel
                            key={address.id}
                            value={address.id}
                            control={<Radio />}
                            label={
                              <Box className="ml-2">
                                <Typography variant="subtitle1" className="font-medium">
                                  {locale === 'ar' ? address.nameAr : address.name}
                                  {address.isDefault && (
                                    <span className="ml-2 text-sm text-primary-600">
                                      ({t('profile.defaultAddress')})
                                    </span>
                                  )}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.recipient}, {address.street}, {address.city}, {address.state} {address.zipCode}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.phone}
                                </Typography>
                              </Box>
                            }
                            className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
                          />
                        ))}
                        
                        <FormControlLabel
                          value="new"
                          control={<Radio />}
                          label={
                            <Typography variant="subtitle1" className="font-medium">
                              {t('checkout.addNewAddress')}
                            </Typography>
                          }
                          className="mt-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
                        />
                      </RadioGroup>
                      
                      {isNewAddress && (
                        <Grid container spacing={2} className="mt-4">
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label={t('profile.addressName')}
                              name="name"
                              value={newAddress.name}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label={t('profile.recipient')}
                              name="recipient"
                              value={newAddress.recipient}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              label={t('profile.streetAddress')}
                              name="street"
                              value={newAddress.street}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label={t('profile.city')}
                              name="city"
                              value={newAddress.city}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label={t('profile.zipCode')}
                              name="zipCode"
                              value={newAddress.zipCode}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              label={t('profile.phone')}
                              name="phone"
                              value={newAddress.phone}
                              onChange={handleNewAddressChange}
                              fullWidth
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={newAddress.isDefault}
                                  onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                  color="primary"
                                />
                              }
                              label={t('profile.setAsDefault')}
                            />
                          </Grid>
                        </Grid>
                      )}
                      
                      <Box className="flex justify-end mt-6">
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          disabled={isNewAddress && (!newAddress.recipient || !newAddress.street || !newAddress.city)}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {t('common.next')}
                        </Button>
                      </Box>
                    </div>
                  )}
                  
                  {/* Step 2: Payment Method */}
                  {activeStep === 1 && (
                    <div>
                      <Typography variant="h5" className="mb-4">
                        {t('checkout.paymentMethod')}
                      </Typography>
                      
                      <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <FormControlLabel
                          value="cash"
                          control={<Radio />}
                          label={
                            <Box className="ml-2">
                              <Typography variant="subtitle1" className="font-medium">
                                {t('checkout.cashOnDelivery')}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {t('checkout.payWithCash')}
                              </Typography>
                            </Box>
                          }
                          className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
                        />
                        
                        <FormControlLabel
                          value="card"
                          control={<Radio />}
                          label={
                            <Box className="ml-2">
                              <Typography variant="subtitle1" className="font-medium">
                                {t('checkout.creditCard')}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {t('checkout.payWithCard')}
                              </Typography>
                            </Box>
                          }
                          className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
                        />
                      </RadioGroup>
                      
                      {paymentMethod === 'card' && (
                        <Alert severity="info" className="mt-4">
                          {t('checkout.cardPaymentMessage')}
                        </Alert>
                      )}
                      
                      <Divider className="my-6" />
                      
                      <Typography variant="h6" className="mb-3">
                        {t('checkout.notes')}
                      </Typography>
                      
                      <TextField
                        label={t('checkout.orderNotes')}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        placeholder={t('checkout.notesPlaceholder') || ''}
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
                    </div>
                  )}
                  
                  {/* Step 3: Review Order */}
                  {activeStep === 2 && (
                    <div>
                      <Typography variant="h5" className="mb-4">
                        {t('checkout.reviewOrder')}
                      </Typography>
                      
                      {/* Shipping Address */}
                      <Card variant="outlined" className="mb-4">
                        <CardContent>
                          <Typography variant="h6" className="mb-2">
                            {t('checkout.shippingAddress')}
                          </Typography>
                          
                          {isNewAddress ? (
                            <Box>
                              <Typography variant="body1">{newAddress.recipient}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {newAddress.street}, {newAddress.city} {newAddress.zipCode}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {newAddress.phone}
                              </Typography>
                            </Box>
                          ) : addressData && (
                            <Box>
                              <Typography variant="body1">{addressData.recipient}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {addressData.street}, {addressData.city}, {addressData.state} {addressData.zipCode}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {addressData.phone}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Payment Method */}
                      <Card variant="outlined" className="mb-4">
                        <CardContent>
                          <Typography variant="h6" className="mb-2">
                            {t('checkout.paymentMethod')}
                          </Typography>
                          
                          <Typography variant="body1">
                            {paymentMethod === 'cash' ? t('checkout.cashOnDelivery') : t('checkout.creditCard')}
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      {/* Order Notes */}
                      {orderNotes && (
                        <Card variant="outlined" className="mb-4">
                          <CardContent>
                            <Typography variant="h6" className="mb-2">
                              {t('checkout.notes')}
                            </Typography>
                            
                            <Typography variant="body2">
                              {orderNotes}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Terms and Conditions */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            color="primary"
                            required
                          />
                        }
                        label={
                          <span>
                            {t('checkout.agreeToTerms')}{' '}
                            <Link href="/terms" className="text-primary-600 hover:underline">
                              {t('checkout.termsLink')}
                            </Link>
                          </span>
                        }
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
                          disabled={!agreedToTerms}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          {t('checkout.placeOrder')}
                        </Button>
                      </Box>
                    </div>
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
                    
                    <Box className="max-h-80 overflow-auto mb-4">
                      {items.map((item) => (
                        <Box key={item.id} className="flex items-center mb-3 pb-3 border-b">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                            <img 
                              src={item.image} 
                              alt={locale === 'ar' ? item.nameAr : item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <Typography variant="body1" className="font-medium">
                              {locale === 'ar' ? item.nameAr : item.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </Typography>
                          </div>
                          <Typography variant="body1" className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Divider className="mb-4" />
                    
                    <Box className="flex justify-between mb-2">
                      <Typography>{t('cart.subtotal')}</Typography>
                      <Typography>${totalAmount.toFixed(2)}</Typography>
                    </Box>
                    
                    <Box className="flex justify-between mb-2">
                      <Typography>{t('cart.shipping')}</Typography>
                      <Typography>${shippingCost.toFixed(2)}</Typography>
                    </Box>
                    
                    <Divider className="my-4" />
                    
                    <Box className="flex justify-between mb-2">
                      <Typography variant="h6" className="font-bold">
                        {t('cart.total')}
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        ${(totalAmount + shippingCost).toFixed(2)}
                      </Typography>
                    </Box>
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