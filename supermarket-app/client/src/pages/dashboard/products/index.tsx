import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, IconButton, Alert, Snackbar,
  TextField, InputAdornment, Chip, Menu, MenuItem
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import { RootState } from '@/store';
import { Product } from '@/types/product';
import { getAllProducts } from '@/services/productService';

// Temporary mock delete function since it's not in the productService yet
const deleteProduct = async (id: string): Promise<boolean> => {
  console.log(`Mock delete product with ID: ${id}`);
  return Promise.resolve(true);
};

const ProductsPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard/products');
      return;
    }

    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        showAlertMessage('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user, router]);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleAddProduct = () => {
    router.push('/dashboard/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/dashboard/products/edit/${id}`);
    setAnchorEl(null);
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmMessage = t('common.confirm') || 'Confirm';
    const deleteMessage = t('owner.confirmDeleteProduct') || 'Are you sure you want to delete this product?';
    
    if (window.confirm(`${confirmMessage}: ${deleteMessage}`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
        showAlertMessage(t('owner.productDeleted') || 'Product deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        showAlertMessage(t('owner.deleteProductError') || 'Failed to delete product', 'error');
      }
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, productId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showAlertMessage = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout>
        <Box className="flex justify-center items-center h-screen">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box className="max-w-7xl mx-auto py-8 px-4">
        <Box className="flex items-center mb-6">
          <IconButton onClick={() => router.push('/dashboard')} className="mr-2">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('owner.products')}
          </Typography>
        </Box>

        <Box className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <Box className="flex">
            <TextField
              placeholder={t('products.search') || 'Search products...'}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              className="min-w-[250px]"
            />
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            {t('owner.addProduct')}
          </Button>
        </Box>

        {filteredProducts.length === 0 ? (
          <Paper elevation={1} className="p-6 text-center">
            <Typography variant="h6">{t('products.noResults')}</Typography>
            <Button 
              variant="text"
              onClick={() => setSearchTerm('')}
              className="mt-2"
            >
              {t('products.clearFilters')}
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('products.title')}</TableCell>
                  <TableCell>{t('products.category')}</TableCell>
                  <TableCell align="right">{t('products.price')}</TableCell>
                  <TableCell align="center">{t('products.inStock')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box className="flex items-center">
                        {product.image && (
                          <Box 
                            component="img" 
                            src={product.image}
                            alt={product.name}
                            sx={{ width: 40, height: 40, marginRight: 2, objectFit: 'cover', borderRadius: 1 }}
                          />
                        )}
                        {product.name}
                      </Box>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={product.stock > 0 ? `${product.stock}` : t('products.outOfStock')}
                        color={product.stock > 0 ? 'success' : 'error'}
                        variant={product.stock > 0 ? 'outlined' : 'filled'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, product.id)}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedProductId && handleEditProduct(selectedProductId)}>
          <EditIcon fontSize="small" className="mr-2" />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={() => selectedProductId && handleDeleteProduct(selectedProductId)}>
          <DeleteIcon fontSize="small" className="mr-2" />
          {t('common.delete')}
        </MenuItem>
      </Menu>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
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