import React from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Button,
  SelectChangeEvent
} from '@mui/material';
import { MagnifyingGlassIcon as SearchIcon, Bars3Icon as FilterIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ProductCategory, SortOption } from '@/types/product';

interface ProductFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  categories: ProductCategory[];
  sortOptions: SortOption[];
  className?: string;
  isMobile?: boolean;
  onOpenFilterDrawer?: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  categories,
  sortOptions,
  className = '',
  isMobile = false,
  onOpenFilterDrawer
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
  
  // Mobile filter view
  if (isMobile) {
    return (
      <Box className={`flex justify-between ${className}`}>
        <TextField
          placeholder={t('product.search')||""}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />,
          }}
          className="flex-grow mr-2"
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon className="h-5 w-5" />}
          onClick={onOpenFilterDrawer}
        >
          {t('product.filter')}
        </Button>
      </Box>
    );
  }
  
  // Desktop filter view
  return (
    <Box className={`flex items-center space-x-4 ${className}`} sx={{ width: '100%' }}>
      {/* Search bar */}
      <TextField
        placeholder={t('product.search')||""}
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />,
        }}
        className="w-full max-w-md"
      />
      
      {/* Category filter */}
      <FormControl variant="outlined" size="small" className="min-w-[180px]">
        <InputLabel>{t('product.category')}</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label={t('product.category')}
        >
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {locale === 'ar' ? category.labelAr : category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Sort filter */}
      <FormControl variant="outlined" size="small" className="min-w-[180px]">
        <InputLabel>{t('product.sort')}</InputLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          label={t('product.sort')}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {locale === 'ar' ? option.labelAr : option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductFilter; 