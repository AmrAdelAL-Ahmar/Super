import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Pagination,
  Alert
} from '@mui/material';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import OrderCard from '@/components/orders/OrderCard';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';
import { OrderStatus, OrderSummary, OrderFilter } from '@/types/order';
import { getOrderSummaries, getFilteredOrders } from '@/services/orderService';

const OrdersPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // State for filtering and pagination
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Items per page
  const itemsPerPage = 5;
  
  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const orderSummaries = await getOrderSummaries();
        setOrders(orderSummaries);
        setLoading(false);
      } catch (err) {
        setError(t('orders.errorLoading', 'Failed to load orders'));
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [t]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1); // Reset to first page when changing tabs
  };
  
  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Filter orders based on tab, search, and sort
  const filteredOrders = orders
    .filter(order => {
      // Filter by tab
      if (tabValue === 0) return true; // All orders
      if (tabValue === 1) return ['pending', 'confirmed', 'processing', 'outForDelivery'].includes(order.status); // Active orders
      if (tabValue === 2) return order.status === 'delivered'; // Completed orders
      if (tabValue === 3) return order.status === 'cancelled'; // Cancelled orders
      return true;
    })
    .filter(order => {
      // Filter by search term
      if (!searchTerm) return true;
      return order.id.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // Sort orders
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (sortBy === 'date') {
        return direction * (new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      if (sortBy === 'total') {
        return direction * (b.total - a.total);
      }
      return 0;
    });
  
  // Paginate orders
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
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
  
  return (
    <MainLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" className="font-bold mb-6">
              {t('orders.title', 'Orders')}
            </Typography>
          </motion.div>
          
          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <Box className="mb-6">
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                className="mb-4"
              >
                <Tab label={t('orders.tabs.all', 'All')} />
                <Tab label={t('orders.tabs.active', 'Active')} />
                <Tab label={t('orders.tabs.completed', 'Completed')} />
                <Tab label={t('orders.tabs.cancelled', 'Cancelled')} />
              </Tabs>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    placeholder={t('orders.searchPlaceholder', 'Search orders...')||""}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="sort-by-label">{t('orders.sortBy', 'Sort by')}</InputLabel>
                    <Select
                      labelId="sort-by-label"
                      value={sortBy}
                      label={t('orders.sortBy', 'Sort by')}
                      onChange={handleSortChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <FunnelIcon className="h-5 w-5 text-gray-400" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="date">{t('orders.sortOptions.date', 'Date')}</MenuItem>
                      <MenuItem value="total">{t('orders.sortOptions.total', 'Total')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
          
          {loading ? (
            <Box className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Box key={index} className="animate-pulse">
                  <Box className="h-32 bg-gray-200 rounded-lg"></Box>
                </Box>
              ))}
            </Box>
          ) : filteredOrders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedOrders.map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order.id}>
                    <OrderCard
                      id={order.id}
                      status={order.status}
                      date={order.date}
                      total={order.total}
                      itemsCount={order.itemsCount}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Box className="flex justify-center mt-8">
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                  />
                </Box>
              )}
            </>
          )}
        </motion.div>
      </Container>
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

export default OrdersPage; 