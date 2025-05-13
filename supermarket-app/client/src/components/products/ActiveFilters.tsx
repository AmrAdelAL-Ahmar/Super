import React from 'react';
import { Box, Chip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ProductCategory } from '@/types/product';
import { motion } from 'framer-motion';

interface ActiveFiltersProps {
  selectedCategory: string;
  onCategoryReset: () => void;
  priceRange: number[];
  onPriceRangeReset: () => void;
  categories: ProductCategory[];
  className?: string;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategory,
  onCategoryReset,
  priceRange,
  onPriceRangeReset,
  categories,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  // If no active filters, don't render anything
  if (selectedCategory === 'all' && priceRange[0] === 0 && priceRange[1] === 20) {
    return null;
  }
  
  return (
    <Box className={`flex flex-wrap gap-2 ${className}`}>
      {selectedCategory !== 'all' && (
        <Chip 
          label={locale === 'ar' 
            ? categories.find(c => c.value === selectedCategory)?.labelAr 
            : categories.find(c => c.value === selectedCategory)?.label
          } 
          onDelete={onCategoryReset}
          color="primary"
          variant="outlined"
        />
      )}
      
      {(priceRange[0] > 0 || priceRange[1] < 20) && (
        <Chip 
          label={`${t('product.price')}: $${priceRange[0]} - $${priceRange[1]}`} 
          onDelete={onPriceRangeReset}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default ActiveFilters; 