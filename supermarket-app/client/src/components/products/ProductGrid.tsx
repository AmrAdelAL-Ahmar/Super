import React from 'react';
import { Grid, Typography, Button, Box, Skeleton } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onClearFilters: () => void;
  loading?: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onClearFilters,
  loading = false,
  className = ''
}) => {
  const { t } = useTranslation('common');
  
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  // Display loading skeletons
  if (loading) {
    return (
      <Grid container spacing={3} className={className}>
        {[...Array(8)].map((_, index) => (
          <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
            <Box className="animate-pulse">
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  
  // No products found
  if (products.length === 0) {
    return (
      <Box className={`text-center py-16 ${className}`}>
        <Typography variant="h6" color="textSecondary">
          {t('products.noResults')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onClearFilters}
          className="mt-4"
        >
          {t('products.clearFilters')}
        </Button>
      </Box>
    );
  }
  
  // Display products grid
  return (
    <Grid container spacing={3} className={className}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
          <motion.div variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid; 