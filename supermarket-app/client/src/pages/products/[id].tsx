import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/features/cart/cartSlice';
import { RootState } from '@/store';
import MainLayout from '@/layouts/MainLayout';
import ProductCard from '@/components/ProductCard';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  Rating, 
  IconButton, 
  TextField, 
  Chip, 
  Divider,
  Tabs,
  Tab,
  Breadcrumbs,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  HeartIcon,
  ShoppingCartIcon,
  ArrowPathIcon as RefreshIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  CheckIcon,
  TruckIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock products data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Apples',
    nameAr: 'تفاح طازج',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    discount: 0,
    unit: 'kg',
    category: 'fruits',
    description: 'Fresh and juicy apples harvested from organic farms. Rich in nutrients and perfect for daily consumption.',
    descriptionAr: 'تفاح طازج وعصير مقطوف من مزارع عضوية. غني بالعناصر الغذائية ومثالي للاستهلاك اليومي.',
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4
    },
    tags: ['organic', 'fresh', 'fruits'],
    tagsAr: ['عضوي', 'طازج', 'فواكه'],
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameAr: 'حليب عضوي',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    discount: 10,
    unit: 'liter',
    category: 'dairy',
    description: 'Organic whole milk from grass-fed cows. Free from antibiotics and hormones.',
    descriptionAr: 'حليب عضوي كامل الدسم من أبقار تتغذى على العشب. خالي من المضادات الحيوية والهرمونات.',
    stock: 30,
    rating: 4.7,
    reviewCount: 96,
    nutrition: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0
    },
    tags: ['organic', 'dairy', 'refrigerated'],
    tagsAr: ['عضوي', 'ألبان', 'مبرد'],
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    nameAr: 'خبز القمح الكامل',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    discount: 0,
    unit: 'loaf',
    category: 'bakery',
    description: 'Freshly baked whole wheat bread made with premium ingredients and traditional methods.',
    descriptionAr: 'خبز القمح الكامل المخبوز طازجًا مصنوع من مكونات عالية الجودة وبطرق تقليدية.',
    stock: 25,
    rating: 4.3,
    reviewCount: 75,
    nutrition: {
      calories: 100,
      protein: 4,
      carbs: 18,
      fat: 1.5,
      fiber: 3
    },
    tags: ['whole grain', 'bakery', 'fresh'],
    tagsAr: ['حبوب كاملة', 'مخبوزات', 'طازج'],
  },
  {
    id: '4',
    name: 'Fresh Chicken',
    nameAr: 'دجاج طازج',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    discount: 15,
    unit: 'kg',
    category: 'meat',
    description: 'Premium quality chicken raised without antibiotics. Perfect for grilling, roasting, or frying.',
    descriptionAr: 'دجاج ذو جودة عالية تم تربيته بدون مضادات حيوية. مثالي للشوي أو التحميص أو القلي.',
    stock: 20,
    rating: 4.6,
    reviewCount: 92,
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0
    },
    tags: ['protein', 'meat', 'refrigerated'],
    tagsAr: ['بروتين', 'لحوم', 'مبرد'],
  },
  {
    id: '5',
    name: 'Organic Tomatoes',
    nameAr: 'طماطم عضوية',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924',
    discount: 0,
    unit: 'kg',
    category: 'vegetables',
    description: 'Vine-ripened organic tomatoes. Juicy, flavorful, and perfect for salads or cooking.',
    descriptionAr: 'طماطم عضوية ناضجة على الكرمة. عصيرية، ذات نكهة رائعة، ومثالية للسلطات أو الطبخ.',
    stock: 40,
    rating: 4.4,
    reviewCount: 68,
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2
    },
    tags: ['organic', 'vegetables', 'fresh'],
    tagsAr: ['عضوي', 'خضروات', 'طازج'],
  }
];

const ProductDetail = ({ product }: { product: any }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = router.locale || 'en';
  const { direction } = useSelector((state: RootState) => state.ui);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState(false);
  
  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
      quantity: quantity,
      stock: product.stock,
      unit: product.unit
    }));
    setNotification(true);
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Get related products
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product?.category && p.id !== product?.id
  ).slice(0, 4);
  
  // Calculate discounted price
  const discountedPrice = product?.discount > 0 
    ? product.price - (product.price * product.discount / 100) 
    : null;
  
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
  
  if (router.isFallback) {
    return (
      <MainLayout>
        <Box className="flex justify-center items-center min-h-[60vh]">
          <RefreshIcon className="h-12 w-12 text-primary-500 animate-spin" />
        </Box>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-8"
      >
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <motion.div variants={itemVariants} className="mb-6">
            <Breadcrumbs separator={locale === 'ar' ? '←' : '→'} aria-label="breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-primary-600">
                {t('navigation.home')}
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-primary-600">
                {t('navigation.products')}
              </Link>
              <Typography color="text.primary">
                {locale === 'ar' ? product.nameAr : product.name}
              </Typography>
            </Breadcrumbs>
          </motion.div>
          
          <Grid container spacing={4}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper elevation={2} className="overflow-hidden rounded-lg relative aspect-square">
                  <img
                    src={product.image}
                    alt={locale === 'ar' ? product.nameAr : product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full py-1 px-3 font-bold text-sm">
                      {product.discount}% {t('products.discount')}
                    </div>
                  )}
                </Paper>
              </motion.div>
            </Grid>
            
            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Typography variant="h4" component="h1" className="font-bold mb-2">
                  {locale === 'ar' ? product.nameAr : product.name}
                </Typography>
                
                <Box className="flex items-center mb-4">
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" className="ml-2 text-gray-600">
                    ({product.reviewCount} {t('products.reviews')})
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  {discountedPrice ? (
                    <div className="flex items-center">
                      <Typography variant="h5" className="font-bold text-primary-600 mr-2">
                        ${discountedPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body1" className="line-through text-gray-500">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </div>
                  ) : (
                    <Typography variant="h5" className="font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </Typography>
                  )}
                  <Typography variant="body2" className="text-gray-600 mt-1">
                    {t('products.per')} {product.unit}
                  </Typography>
                </Box>
                
                <Divider className="mb-4" />
                
                <Typography variant="body1" className="mb-4">
                  {locale === 'ar' ? product.descriptionAr : product.description}
                </Typography>
                
                <Box className="flex items-center mb-4">
                  <InformationCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <Typography variant="body2">
                    {product && product.stock > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {t('products.inStock')} ({product.stock} {t('products.available')})
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {t('products.outOfStock')}
                      </span>
                    )}
                  </Typography>
                </Box>
                
                <Box className="flex items-center mb-4">
                  <TruckIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <Typography variant="body2">
                    {t('products.deliveryAvailable')}
                  </Typography>
                </Box>
                
                <Box className="mb-6">
                  {(locale === 'ar' ? product.tagsAr : product.tags).map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className="mr-2 mb-2"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                {product && product.stock > 0 && (
                  <>
                    <Box className="flex items-center mb-4">
                      <Typography variant="body1" className="mr-4">
                        {t('products.quantity')}:
                      </Typography>
                      <Box className="flex items-center">
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </IconButton>
                        
                        <TextField
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(value);
                            }
                          }}
                          inputProps={{ min: 1, max: product.stock }}
                          size="small"
                          className="w-16 mx-2"
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box className="flex space-x-3" dir="ltr">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon className="h-5 w-5" />}
                        onClick={handleAddToCart}
                        fullWidth
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        {t('products.addToCart')}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<HeartIcon className="h-5 w-5" />}
                      >
                        {t('products.addToWishlist')}
                      </Button>
                    </Box>
                  </>
                )}
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Tabs Section */}
          <motion.div variants={itemVariants} className="mt-12">
            <Paper elevation={1} className="p-4">
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={t('products.details')} />
                <Tab label={t('products.nutritionInfo')} />
                <Tab label={t('products.reviews')} />
              </Tabs>
              
              <Box className="p-4">
                {activeTab === 0 && (
                  <Typography variant="body1">
                    {locale === 'ar' ? product.descriptionAr : product.description}
                    <br /><br />
                    {t('products.origin')}: {locale === 'ar' ? 'مزارع محلية' : 'Local Farms'}
                    <br />
                    {t('products.storageInstructions')}: {locale === 'ar' ? 'يحفظ في مكان بارد وجاف' : 'Store in a cool, dry place'}
                  </Typography>
                )}
                
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" className="mb-3">
                      {t('products.nutritionalValues')}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Paper elevation={0} className="p-3 text-center bg-gray-50">
                          <Typography variant="body2" color="textSecondary">
                            {t('products.calories')}
                          </Typography>
                          <Typography variant="h6">
                            {product.nutrition.calories}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Paper elevation={0} className="p-3 text-center bg-gray-50">
                          <Typography variant="body2" color="textSecondary">
                            {t('products.protein')}
                          </Typography>
                          <Typography variant="h6">
                            {product.nutrition.protein}g
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Paper elevation={0} className="p-3 text-center bg-gray-50">
                          <Typography variant="body2" color="textSecondary">
                            {t('products.carbs')}
                          </Typography>
                          <Typography variant="h6">
                            {product.nutrition.carbs}g
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Paper elevation={0} className="p-3 text-center bg-gray-50">
                          <Typography variant="body2" color="textSecondary">
                            {t('products.fat')}
                          </Typography>
                          <Typography variant="h6">
                            {product.nutrition.fat}g
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="body2" className="mt-4">
                      {t('products.nutritionDisclaimer')}
                    </Typography>
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="body1" className="mb-4">
                      {t('products.noReviewsYet')}
                    </Typography>
                    
                    <Button variant="outlined">
                      {t('products.writeReview')}
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div variants={itemVariants} className="mt-12">
              <Typography variant="h5" className="font-bold mb-6">
                {t('products.relatedProducts')}
              </Typography>
              
              <Grid container spacing={3}>
                {relatedProducts.map((relatedProduct) => (
                  <Grid item key={relatedProduct.id} xs={12} sm={6} md={3}>
                    <ProductCard product={relatedProduct} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Add to cart notification */}
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification(false)} severity="success">
          {t('products.addedToCart')}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real application, you would fetch these IDs from an API
  const paths = MOCK_PRODUCTS.map((product) => ({
    params: { id: product.id },
    locale: 'en'
  }));

  // Also generate Arabic paths
  const arPaths = MOCK_PRODUCTS.map((product) => ({
    params: { id: product.id },
    locale: 'ar'
  }));

  return {
    paths: [...paths, ...arPaths],
    fallback: 'blocking', // Change to blocking for better user experience
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  // In a real application, you would fetch this data from an API
  const product = MOCK_PRODUCTS.find((p) => p.id === params?.id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      product,
    },
    // Re-generate the page at most once per hour
    revalidate: 3600,
  };
};

export default ProductDetail; 