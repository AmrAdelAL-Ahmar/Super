import React from 'react';
import { 
  Box, 
  Drawer, 
  Typography, 
  IconButton, 
  Divider, 
  FormControl, 
  Select, 
  MenuItem, 
  Slider, 
  Button,
  SelectChangeEvent
} from '@mui/material';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ProductCategory, SortOption } from '@/types/product';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  categories: ProductCategory[];
  sortOptions: SortOption[];
  onClearFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  categories,
  sortOptions,
  onClearFilters
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  const handleCategoryChange = (event: SelectChangeEvent) => {
    onCategoryChange(event.target.value);
  };
  
  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value);
  };
  
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    onPriceRangeChange(newValue as number[]);
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 280 }} p={3}>
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6">{t('product.filter')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon className="h-5 w-5" />
          </IconButton>
        </Box>
        
        <Divider className="mb-4" />
        
        <Typography variant="subtitle2" className="mb-2">
          {t('product.category')}
        </Typography>
        <FormControl fullWidth className="mb-4">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            size="small"
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {locale === 'ar' ? category.labelAr : category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="subtitle2" className="mb-2">
          {t('product.sort')}
        </Typography>
        <FormControl fullWidth className="mb-4">
          <Select
            value={sortOption}
            onChange={handleSortChange}
            size="small"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {locale === 'ar' ? option.labelAr : option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="subtitle2" className="mb-2">
          {t('product.priceRange')}
        </Typography>
        <Box px={1}>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={20}
            step={1}
          />
          <Box className="flex justify-between">
            <Typography variant="body2">${priceRange[0]}</Typography>
            <Typography variant="body2">${priceRange[1]}</Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          className="mt-4"
          onClick={onClose}
        >
          {t('product.applyFilters')}
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth 
          className="mt-2"
          onClick={onClearFilters}
        >
          {t('product.clearFilters')}
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer; 