import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, IconButton, Alert, Snackbar,
  TextField, InputAdornment, Chip, Tabs, Tab
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import { RootState } from '@/store';
import { Order, OrderStatus } from '@/types/order';
import { getOrders } from '@/services/orderService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Update interface for orders expected in this component
interface OrderWithCustomer extends Order {
  customer: {
    name: string;
  };
  orderNumber: number | string;
  createdAt: string;
  totalAmount: number;
}

const OrdersPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard/orders');
      return;
    }

    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        // Transform the orders to match the expected format
        const formattedOrders: OrderWithCustomer[] = data.map(order => ({
          ...order,
          customer: {
            name: order.shippingAddress.recipient
          },
          orderNumber: order.id.replace('ORD-', ''),
          createdAt: order.date,
          totalAmount: order.total
        }));
        
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showAlertMessage('Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, router]);

  useEffect(() => {
    // Filter orders based on search term and current tab
    let filtered = orders;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toString().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(order => ['pending', 'confirmed'].includes(order.status));
    } else if (tabValue === 2) {
      filtered = filtered.filter(order => order.status === 'processing');
    } else if (tabValue === 3) {
      filtered = filtered.filter(order => ['delivered', 'outForDelivery'].includes(order.status));
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, orders, tabValue]);

  const handleViewOrder = (id: string) => {
    router.push(`/dashboard/orders/${id}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusChip = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', label: string }> = {
      'pending': { color: 'default', label: t('order.status.pending') || 'Pending' },
      'confirmed': { color: 'info', label: t('order.status.confirmed') || 'Confirmed' },
      'processing': { color: 'primary', label: t('order.status.processing') || 'Processing' },
      'outForDelivery': { color: 'secondary', label: t('order.status.outForDelivery') || 'Out for Delivery' },
      'delivered': { color: 'success', label: t('order.status.delivered') || 'Delivered' },
      'cancelled': { color: 'error', label: t('order.status.cancelled') || 'Cancelled' }
    };

    return (
      <Chip 
        label={statusColors[status].label}
        color={statusColors[status].color}
        size="small"
      />
    );
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
            {t('owner.orders')}
          </Typography>
        </Box>

        <Paper className="mb-6">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t('orders.tabs.all') || 'All Orders'} />
            <Tab label={t('owner.newOrders') || 'New Orders'} />
            <Tab label={t('owner.processingOrders') || 'Processing'} />
            <Tab label={t('owner.deliveredOrders') || 'Delivered'} />
          </Tabs>

          <Box className="p-4 flex justify-between items-center flex-wrap gap-2">
            <TextField
              placeholder={t('orders.searchPlaceholder') || 'Search orders...'}
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
            
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<ShippingIcon />}
                onClick={() => router.push('/dashboard/deliveries')}
              >
                {t('owner.deliveries')}
              </Button>
            </Box>
          </Box>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {renderOrdersTable(filteredOrders)}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderOrdersTable(filteredOrders)}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {renderOrdersTable(filteredOrders)}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {renderOrdersTable(filteredOrders)}
        </TabPanel>
      </Box>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );

  function renderOrdersTable(orders: OrderWithCustomer[]) {
    if (orders.length === 0) {
      return (
        <Paper elevation={1} className="p-6 text-center">
          <Typography variant="h6">{t('orders.empty') || 'No orders found'}</Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('orders.orderNumber') || 'Order #'}</TableCell>
              <TableCell>{t('orders.date') || 'Date'}</TableCell>
              <TableCell>{t('order.customer') || 'Customer'}</TableCell>
              <TableCell>{t('orders.status') || 'Status'}</TableCell>
              <TableCell align="right">{t('orders.total') || 'Total'}</TableCell>
              <TableCell align="center">{t('orders.details') || 'Details'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.orderNumber}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{getStatusChip(order.status)}</TableCell>
                <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleViewOrder(order.id)}
                    size="small"
                    color="primary"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default OrdersPage; 