import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  title,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Typography variant="h5" component="h2" className="font-bold mb-6">
        {title || t('product.relatedProducts')}
      </Typography>
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default RelatedProducts; 