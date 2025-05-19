import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Grid, Paper, Card, CardContent, 
  CardHeader, Divider, Button, CircularProgress
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon, 
  Inventory as InventoryIcon, 
  LocalShipping as ShippingIcon,
  ListAlt as OrdersIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import { RootState } from '@/store';
import { DashboardMenuItem, DashboardPageProps, PageAccessControl } from '@/types/dashboard';
import { UserRole } from '@/types/user';

const Dashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  // Access control configuration
  const accessControl: PageAccessControl = {
    requiredRole: 'owner',
    redirectPath: '/'
  };

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard');
      return;
    }

    if (user.role !== accessControl.requiredRole) {
      router.push(accessControl.redirectPath);
      return;
    }

    setLoading(false);
  }, [user, router, accessControl]);

  // Dashboard menu items
  const menuItems: DashboardMenuItem[] = [
    {
      title: t('owner.products'),
      description: t('owner.manageProducts') || 'Manage your store products',
      icon: <InventoryIcon fontSize="large" color="primary" />,
      link: '/dashboard/products'
    },
    {
      title: t('owner.orders'),
      description: t('owner.manageOrders') || 'View and manage customer orders',
      icon: <OrdersIcon fontSize="large" color="primary" />,
      link: '/dashboard/orders'
    },
    {
      title: t('owner.employees'),
      description: t('owner.manageEmployees') || 'Manage delivery staff',
      icon: <PeopleIcon fontSize="large" color="primary" />,
      link: '/dashboard/employees'
    },
    {
      title: t('owner.deliveries'),
      description: t('owner.trackDeliveries') || 'Track ongoing deliveries',
      icon: <ShippingIcon fontSize="large" color="primary" />,
      link: '/dashboard/deliveries'
    },
    {
      title: t('owner.statistics'),
      description: t('owner.viewStatistics') || 'View store statistics and reports',
      icon: <StatsIcon fontSize="large" color="primary" />,
      link: '/dashboard/statistics'
    }
  ];

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
        <Typography variant="h4" component="h1" className="mb-6">
          {t('owner.dashboard')}
        </Typography>

        <Box className="mb-8">
          <Paper elevation={3} className="p-6">
            <Typography variant="h5" className="mb-4">
              {t('owner.welcome') || 'Welcome to your Dashboard'}
            </Typography>
            <Typography variant="body1">
              {t('owner.dashboardDescription') || 'Manage your supermarket, monitor orders, and track deliveries all in one place.'}
            </Typography>
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                className="h-full transition-all hover:shadow-lg cursor-pointer"
                onClick={() => router.push(item.link)}
              >
                <CardHeader
                  avatar={item.icon}
                  title={<Typography variant="h6">{item.title}</Typography>}
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }): Promise<{ props: DashboardPageProps }> {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
}

export default Dashboard; 