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
import { getProductById, getRelatedProducts, getAllProducts } from '@/services/productService';
import { Product, isProductInStock } from '@/types/product';

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
      unit: product.unit,
      discount: product.discount
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
  
  const isInStock = isProductInStock(product);
  
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
              <Link href="/" passHref legacyBehavior>
                <a className="text-gray-500 hover:text-primary-600">
                  {t('navigation.home')}
                </a>
              </Link>
              <Link href="/products" passHref legacyBehavior>
                <a className="text-gray-500 hover:text-primary-600">
                  {t('navigation.products')}
                </a>
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
                  <NutritionInfo nutrition={product.nutrition} />
                )}
                
                {activeTab === 2 && (
                  <Box className="text-center py-8">
                    <Typography variant="body1">
                      {t('products.noReviewsYet')}
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
          {t('products.addedToCart')}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => {
  // Fetch all products to generate paths
  const products = await getAllProducts();
  
  // Create paths for all products in all locales
  const paths = products.flatMap((product) => 
    locales.map((locale) => ({
      params: { id: product.id },
      locale
    }))
  );
  
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  const id = params?.id as string;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      notFound: true,
    };
  }
  
  const relatedProducts = await getRelatedProducts(id);
  
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