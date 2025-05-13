import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';
import ProductCard from '@/components/ProductCard';
import { 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Pagination, 
  Box, 
  Chip,
  Button,
  Drawer,
  IconButton,
  Slider,
  Divider,
} from '@mui/material';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  Bars3Icon as FilterIcon, 
  XMarkIcon as CloseIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock product data
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
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    nameAr: 'زبادي يوناني',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1571212515416-fca973f5e67b',
    discount: 5,
    unit: 'pack',
    category: 'dairy',
  },
  {
    id: '7',
    name: 'Fresh Salmon',
    nameAr: 'سمك السلمون الطازج',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c',
    discount: 0,
    unit: 'kg',
    category: 'seafood',
  },
  {
    id: '8',
    name: 'Almond Cookies',
    nameAr: 'بسكويت باللوز',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    discount: 20,
    unit: 'pack',
    category: 'bakery',
  },
];

// Category options
const CATEGORIES = [
  { value: 'all', label: 'All Categories', labelAr: 'جميع الفئات' },
  { value: 'fruits', label: 'Fruits', labelAr: 'فواكه' },
  { value: 'vegetables', label: 'Vegetables', labelAr: 'خضروات' },
  { value: 'dairy', label: 'Dairy', labelAr: 'منتجات الألبان' },
  { value: 'meat', label: 'Meat', labelAr: 'لحوم' },
  { value: 'seafood', label: 'Seafood', labelAr: 'مأكولات بحرية' },
  { value: 'bakery', label: 'Bakery', labelAr: 'مخبوزات' },
];

// Sort options
const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)', labelAr: 'الاسم (أ-ي)' },
  { value: 'name_desc', label: 'Name (Z-A)', labelAr: 'الاسم (ي-أ)' },
  { value: 'price_asc', label: 'Price (Low to High)', labelAr: 'السعر (الأقل إلى الأعلى)' },
  { value: 'price_desc', label: 'Price (High to Low)', labelAr: 'السعر (الأعلى إلى الأقل)' },
  { value: 'discount', label: 'Discount', labelAr: 'الخصم' },
];

const ProductsPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  
  // Products per page
  const productsPerPage = 8;
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...MOCK_PRODUCTS];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.nameAr.includes(searchTerm)
        );
      });
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(
      product => {
        const discountedPrice = product.discount > 0 
          ? product.price - (product.price * product.discount / 100) 
          : product.price;
        return discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1];
      }
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, sortOption, priceRange]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle price range change
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };
  
  // Motion variants
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
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              component="h1"
              className="text-center font-bold text-gray-800 mb-8"
            >
              {t('products.title')}
            </Typography>
          </motion.div>
          
          {/* Filters for desktop */}
          <motion.div variants={itemVariants} className="hidden md:flex justify-between mb-6">
            <Box className="flex items-center space-x-4" sx={{ width: '100%' }}>
              {/* Search bar */}
              <TextField
                placeholder={t('products.search')||""}
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />,
                }}
                className="w-full max-w-md"
              />
              
              {/* Category filter */}
              <FormControl variant="outlined" size="small" className="min-w-[180px]">
                <InputLabel>{t('products.category')}</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label={t('products.category')}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {locale === 'ar' ? category.labelAr : category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Sort filter */}
              <FormControl variant="outlined" size="small" className="min-w-[180px]">
                <InputLabel>{t('products.sort')}</InputLabel>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label={t('products.sort')}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {locale === 'ar' ? option.labelAr : option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </motion.div>
          
          {/* Filters for mobile */}
          <motion.div variants={itemVariants} className="flex md:hidden justify-between mb-6">
            <TextField
              placeholder={t('products.search')||""}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />,
              }}
              className="flex-grow mr-2"
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon className="h-5 w-5" />}
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              {t('products.filter')}
            </Button>
          </motion.div>
          
          {/* Active filters */}
          {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 20) && (
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'all' && (
                <Chip 
                  label={locale === 'ar' 
                    ? CATEGORIES.find(c => c.value === selectedCategory)?.labelAr 
                    : CATEGORIES.find(c => c.value === selectedCategory)?.label
                  } 
                  onDelete={() => setSelectedCategory('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 20) && (
                <Chip 
                  label={`${t('products.price')}: $${priceRange[0]} - $${priceRange[1]}`} 
                  onDelete={() => setPriceRange([0, 20])}
                  color="primary"
                  variant="outlined"
                />
              )}
            </motion.div>
          )}
          
          {/* Products grid */}
          {displayedProducts.length > 0 ? (
            <Grid container spacing={3} className="mb-8">
              {displayedProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-16">
              <Typography variant="h6" color="textSecondary">
                {t('products.noResults')}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange([0, 20]);
                  setSortOption('name_asc');
                }}
                className="mt-4"
              >
                {t('products.clearFilters')}
              </Button>
            </motion.div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div variants={itemVariants} className="flex justify-center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </motion.div>
          )}
        </motion.div>
      </Container>
      
      {/* Filter drawer for mobile */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 280 }} p={3}>
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">{t('products.filter')}</Typography>
            <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon className="h-5 w-5" />
            </IconButton>
          </Box>
          
          <Divider className="mb-4" />
          
          <Typography variant="subtitle2" className="mb-2">
            {t('products.category')}
          </Typography>
          <FormControl fullWidth className="mb-4">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="small"
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {locale === 'ar' ? category.labelAr : category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" className="mb-2">
            {t('products.sort')}
          </Typography>
          <FormControl fullWidth className="mb-4">
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              size="small"
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {locale === 'ar' ? option.labelAr : option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" className="mb-2">
            {t('products.priceRange')}
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
            onClick={() => setIsFilterDrawerOpen(false)}
          >
            {t('products.applyFilters')}
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth 
            className="mt-2"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange([0, 20]);
              setSortOption('name_asc');
            }}
          >
            {t('products.clearFilters')}
          </Button>
        </Box>
      </Drawer>
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

export default ProductsPage; 