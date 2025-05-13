import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { addItem } from '@/features/cart/cartSlice';
import MainLayout from '@/layouts/MainLayout';
import { 
  Typography, 
  Box, 
  Grid, 
  Breadcrumbs,
  Tabs,
  Tab,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';

// Import product components
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import NutritionInfo from '@/components/products/NutritionInfo';
import RelatedProducts from '@/components/products/RelatedProducts';

// Import services
import { getProductById, getRelatedProducts } from '@/services/productService';
import { Product } from '@/types/product';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetail = ({ product, relatedProducts }: ProductDetailProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = router.locale || 'en';
  
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState(false);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle add to cart
  const handleAddToCart = (quantity: number) => {
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
          <CircularProgress />
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
            {/* Product Image Gallery */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <ProductGallery 
                  mainImage={product.image}
                  alt={locale === 'ar' ? product.nameAr : product.name}
                  discount={product.discount}
                />
              </motion.div>
            </Grid>
            
            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <ProductInfo 
                  product={product}
                  onAddToCart={handleAddToCart}
                />
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
                <Tab label={t('product.details')} />
                <Tab label={t('product.nutritionInfo')} />
                <Tab label={t('product.reviews')} />
              </Tabs>
              
              <Box className="p-4">
                {activeTab === 0 && (
                  <Typography variant="body1">
                    {locale === 'ar' ? product.descriptionAr : product.description}
                    <br /><br />
                    {t('product.origin')}: {locale === 'ar' ? 'مزارع محلية' : 'Local Farms'}
                    <br />
                    {t('product.storageInstructions')}: {locale === 'ar' ? 'يحفظ في مكان بارد وجاف' : 'Store in a cool, dry place'}
                  </Typography>
                )}
                
                {activeTab === 1 && (
                  <NutritionInfo nutrition={product.nutrition} />
                )}
                
                {activeTab === 2 && (
                  <Box className="text-center py-8">
                    <Typography variant="body1">
                      {t('product.noReviewsYet')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
          
          {/* Related Products */}
          <motion.div variants={itemVariants} className="mt-12">
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Notification */}
      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() => setNotification(false)}
      >
        <Alert severity="success" onClose={() => setNotification(false)}>
          {t('product.addedToCartSuccess')}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, we would fetch all product IDs from the API
  // For now, we'll use our mock data IDs
  const products = await getProductById('1').then(product => [product]);
  
  const paths = products.map((product) => ({
    params: { id: product?.id || '1' },
  }));
  
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  const id = params?.id as string;
  const product = await getProductById(id);
  const relatedProducts = await getRelatedProducts(id);
  
  if (!product) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      product,
      relatedProducts,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

export default ProductDetail; 