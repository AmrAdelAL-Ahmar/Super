import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onClearFilters: () => void;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onClearFilters,
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
  
  if (products.length === 0) {
    return (
      <Box className={`text-center py-16 ${className}`}>
        <Typography variant="h6" color="textSecondary">
          {t('product.noResults')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onClearFilters}
          className="mt-4"
        >
          {t('product.clearFilters')}
        </Button>
      </Box>
    );
  }
  
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