import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/layouts/MainLayout';
import { 
  Container, 
  Typography, 
  Pagination, 
  Box
} from '@mui/material';
import { motion } from 'framer-motion';

// Import components
import ProductFilter from '@/components/products/ProductFilter';
import FilterDrawer from '@/components/products/FilterDrawer';
import ActiveFilters from '@/components/products/ActiveFilters';
import ProductGrid from '@/components/products/ProductGrid';

// Import services and types
import { getAllProducts, getAllCategories } from '@/services/productService';
import { Product, ProductCategory, SortOption } from '@/types/product';

interface ProductsPageProps {
  products: Product[];
  categories: ProductCategory[];
}

// Sort options
const SORT_OPTIONS: SortOption[] = [
  { value: 'name_asc', label: 'Name (A-Z)', labelAr: 'الاسم (أ-ي)' },
  { value: 'name_desc', label: 'Name (Z-A)', labelAr: 'الاسم (ي-أ)' },
  { value: 'price_asc', label: 'Price (Low to High)', labelAr: 'السعر (الأقل إلى الأعلى)' },
  { value: 'price_desc', label: 'Price (High to Low)', labelAr: 'السعر (الأعلى إلى الأقل)' },
  { value: 'discount', label: 'Discount', labelAr: 'الخصم' },
];

const ProductsPage = ({ products, categories }: ProductsPageProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Products per page
  const productsPerPage = 8;
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
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
  }, [searchTerm, selectedCategory, sortOption, priceRange, products]);
  
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
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 20]);
    setSortOption('name_asc');
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
              {t('product.title')}
            </Typography>
          </motion.div>
          
          {/* Filters for desktop */}
          <motion.div variants={itemVariants} className="hidden md:block mb-6">
            <ProductFilter 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              categories={categories}
              sortOptions={SORT_OPTIONS}
            />
          </motion.div>
          
          {/* Filters for mobile */}
          <motion.div variants={itemVariants} className="md:hidden mb-6">
            <ProductFilter 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
              categories={categories}
              sortOptions={SORT_OPTIONS}
              isMobile={true}
              onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
            />
          </motion.div>
          
          {/* Active filters */}
          <motion.div variants={itemVariants} className="mb-4">
            <ActiveFilters 
              selectedCategory={selectedCategory}
              onCategoryReset={() => setSelectedCategory('all')}
              priceRange={priceRange}
              onPriceRangeReset={() => setPriceRange([0, 20])}
              categories={categories}
            />
          </motion.div>
          
          {/* Products grid */}
          <motion.div variants={itemVariants} className="mb-8">
            <ProductGrid 
              products={displayedProducts}
              onClearFilters={handleClearFilters}
            />
          </motion.div>
          
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
      <FilterDrawer 
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        categories={categories}
        sortOptions={SORT_OPTIONS}
        onClearFilters={handleClearFilters}
      />
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      products,
      categories,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default ProductsPage; 