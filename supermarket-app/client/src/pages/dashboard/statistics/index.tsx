import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Paper, Grid, CircularProgress, 
  Card, CardContent, Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import { RootState } from '@/store';
import { getOrders } from '@/services/orderService';
import { Order } from '@/types/order';

// Fake chart component until we add a real chart library
const FakeChart = ({ title }: { title: string }) => (
  <Box className="p-6 border border-gray-200 rounded-md">
    <Typography variant="subtitle1" gutterBottom>{title}</Typography>
    <Box className="h-40 bg-gray-100 flex items-center justify-center">
      <Typography variant="body2" color="text.secondary">Chart visualization will be implemented with a real chart library</Typography>
    </Box>
  </Box>
);

// Interface for stats
interface Stats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  bestSellingItems: { name: string; quantity: number }[];
}

const StatisticsPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    bestSellingItems: []
  });

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard/statistics');
      return;
    }

    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    // Fetch statistics data
    const fetchStats = async () => {
      try {
        const orders = await getOrders();
        
        // Calculate statistics from orders
        const calculatedStats = calculateStats(orders);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, router]);

  // Calculate statistics from orders data
  const calculateStats = (orders: Order[]): Stats => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed'].includes(order.status)
    ).length;
    
    const processingOrders = orders.filter(order => 
      order.status === 'processing'
    ).length;
    
    const deliveredOrders = orders.filter(order => 
      order.status === 'delivered'
    ).length;
    
    // Calculate best-selling items
    const itemsMap = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const currentQuantity = itemsMap.get(item.name) || 0;
        itemsMap.set(item.name, currentQuantity + item.quantity);
      });
    });
    
    const bestSellingItems = Array.from(itemsMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      bestSellingItems
    };
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
          <ArrowBackIcon 
            className="mr-2 cursor-pointer" 
            onClick={() => router.push('/dashboard')}
          />
          <Typography variant="h4" component="h1">
            {t('owner.statistics')}
          </Typography>
        </Box>

        {/* Overview cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={t('owner.totalSales') || 'Total Sales'} 
              value={formatCurrency(stats.totalSales)}
              icon={<MoneyIcon fontSize="large" color="primary" />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={t('owner.totalOrders') || 'Total Orders'} 
              value={stats.totalOrders.toString()}
              icon={<CartIcon fontSize="large" color="primary" />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={t('owner.averageOrder') || 'Average Order'} 
              value={formatCurrency(stats.averageOrderValue)}
              icon={<TrendingUpIcon fontSize="large" color="primary" />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={t('owner.pendingDeliveries') || 'Pending Deliveries'} 
              value={stats.pendingOrders.toString()}
              icon={<ShippingIcon fontSize="large" color="primary" />}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={8}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                {t('owner.salesTrend') || 'Sales Trend'}
              </Typography>
              <FakeChart title={t('owner.monthlySales') || 'Monthly Sales'} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper className="p-4 h-full">
              <Typography variant="h6" className="mb-4">
                {t('owner.orderStatus') || 'Order Status'}
              </Typography>
              <Box className="flex flex-col space-y-4">
                <OrderStatusItem 
                  label={t('order.status.pending') || 'Pending'} 
                  value={stats.pendingOrders} 
                  color="#e0e0e0"
                />
                <OrderStatusItem 
                  label={t('order.status.processing') || 'Processing'} 
                  value={stats.processingOrders} 
                  color="#bbdefb"
                />
                <OrderStatusItem 
                  label={t('order.status.delivered') || 'Delivered'} 
                  value={stats.deliveredOrders} 
                  color="#c8e6c9"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Product performance */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                {t('owner.topProducts') || 'Top Selling Products'}
              </Typography>
              <Box className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('products.title') || 'Product'}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('products.quantity') || 'Quantity'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.bestSellingItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Typography variant="body2">{item.name}</Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Typography variant="body2">{item.quantity}</Typography>
                        </td>
                      </tr>
                    ))}
                    {stats.bestSellingItems.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 text-center">
                          <Typography variant="body2">
                            {t('owner.noProductsData') || 'No product data available'}
                          </Typography>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card className="h-full">
    <CardContent>
      <Box className="flex justify-between items-start">
        <div>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h5" component="h2">
            {value}
          </Typography>
        </div>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

// Order status component
interface OrderStatusItemProps {
  label: string;
  value: number;
  color: string;
}

const OrderStatusItem = ({ label, value, color }: OrderStatusItemProps) => (
  <Box>
    <Box className="flex justify-between mb-1">
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
    <Box className="w-full bg-gray-200 rounded-full h-2.5">
      <Box 
        className="h-2.5 rounded-full" 
        sx={{ 
          backgroundColor: color,
          width: `${Math.min(100, value * 5)}%`
        }}
      />
    </Box>
  </Box>
);

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default StatisticsPage; 