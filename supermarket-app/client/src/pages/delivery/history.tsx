import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Button, 
  TextField, 
  InputAdornment, 
  Grid, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination
} from '@mui/material';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { DeliveryHistory } from '@/types/delivery';
import { getDeliveryHistory } from '@/services/deliveryService';

const DeliveryHistoryPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<DeliveryHistory[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  
  // Items per page
  const itemsPerPage = 5;
  
  useEffect(() => {
    // Fetch delivery history
    const fetchHistory = async () => {
      try {
        const historyData = await getDeliveryHistory();
        setHistory(historyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery history:', error);
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
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
  
  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const historyData = await getDeliveryHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error refreshing delivery history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter history based on tab, search, and sort
  const filteredHistory = history
    .filter(item => {
      // Filter by tab
      if (tabValue === 0) return true; // All
      if (tabValue === 1) return item.status === 'delivered'; // Delivered
      if (tabValue === 2) return item.status === 'cancelled'; // Cancelled
      return true;
    })
    .filter(item => {
      // Filter by search term
      if (!searchTerm) return true;
      return (
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort history
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });
  
  // Paginate history
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(router.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (status: 'delivered' | 'cancelled'): string => {
    switch (status) {
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <DeliveryLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" component="h1" className="font-bold mb-6">
            {t('delivery.history.title', 'Delivery History')}
          </Typography>
          
          <Box className="mb-6">
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              className="mb-4"
            >
              <Tab label={t('delivery.history.tabs.all', 'All')} />
              <Tab label={t('delivery.history.tabs.delivered', 'Delivered')} />
              <Tab label={t('delivery.history.tabs.cancelled', 'Cancelled')} />
            </Tabs>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('delivery.history.search', 'Search deliveries...') || ''}
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
                  <InputLabel id="sort-by-label">{t('delivery.history.sortBy', 'Sort by')}</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    label={t('delivery.history.sortBy', 'Sort by')}
                    onChange={handleSortChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="date">{t('delivery.history.sortOptions.date', 'Date')}</MenuItem>
                    <MenuItem value="amount">{t('delivery.history.sortOptions.amount', 'Amount')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={12} md={5} className="flex justify-end">
                <Button
                  variant="outlined"
                  startIcon={<ArrowPathIcon className="h-5 w-5" />}
                  onClick={handleRefresh}
                >
                  {t('delivery.history.refresh', 'Refresh')}
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : filteredHistory.length === 0 ? (
            <Paper elevation={0} className="p-8 text-center">
              <Box className="flex flex-col items-center">
                <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-gray-400" />
                </Box>
                
                <Typography variant="h6" className="font-bold mb-2">
                  {t('delivery.history.noDeliveries', 'No deliveries found')}
                </Typography>
                
                <Typography variant="body1" color="textSecondary">
                  {t('delivery.history.noDeliveriesDescription', 'We couldn\'t find any deliveries matching your criteria.')}
                </Typography>
              </Box>
            </Paper>
          ) : (
            <>
              <Paper elevation={1}>
                <List disablePadding>
                  {paginatedHistory.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <ListItem 
                        button 
                        onClick={() => router.push(`/delivery/history/${item.id}`)}
                        className="py-4"
                      >
                        <ListItemText
                          primary={
                            <Box className="flex justify-between items-center">
                              <Typography variant="subtitle1" className="font-medium">
                                {item.id}
                              </Typography>
                              <Chip 
                                label={t(`delivery.status.${item.status}`, item.status)}
                                color={getStatusColor(item.status) as any}
                                size="small"
                                icon={item.status === 'delivered' ? 
                                  <CheckCircleIcon className="h-4 w-4" /> : 
                                  <XCircleIcon className="h-4 w-4" />
                                }
                              />
                            </Box>
                          }
                          secondary={
                            <Box className="mt-1">
                              <Box className="flex justify-between items-center mb-1">
                                <Typography variant="body2" className="text-gray-600">
                                  {item.customer}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                  ${item.amount.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box className="flex justify-between items-center">
                                <Typography variant="body2" color="textSecondary" noWrap className="max-w-[70%]">
                                  {item.address}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {formatDate(item.date)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
              
              {totalPages > 1 && (
                <Box className="flex justify-center mt-6">
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
    </DeliveryLayout>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default DeliveryHistoryPage; 