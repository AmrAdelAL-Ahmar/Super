import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { LocalShipping as DeliveryIcon } from '@mui/icons-material';

// Import reusable components
import AuthForm from '@/components/auth/AuthForm';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';

// Import services
import { loginUser } from '@/services/authService';

const DeliveryLogin = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Call the login API service
      const user = await loginUser({
        email: formData.email,
        password: formData.password
      });
      
      // Check if the user is a delivery employee
      if (user.role !== 'delivery') {
        setError(t('delivery.unauthorized') || 'This account does not have delivery staff permissions');
        setLoading(false);
        return;
      }
      
      // Dispatch login action with the user data from the API
      dispatch(login({ 
        user: user
      }));
      
      // Redirect to delivery dashboard
      router.push('/delivery');
      
    } catch (err: any) {
      // Handle specific error cases
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError(t('auth.invalidCredentials') || 'Invalid email or password');
        } else {
          setError(err.response.data?.error || t('auth.loginError') || 'Login failed');
        }
      } else if (err.request) {
        // No response received from server
        setError(t('auth.serverUnavailable') || 'Server unavailable. Please try again later.');
      } else {
        // Something else went wrong
        setError(t('auth.loginError') || 'An error occurred during login');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <Box className="py-12">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <Paper elevation={3} className="p-6">
              <Box className="flex flex-col items-center mb-6">
                <DeliveryIcon fontSize="large" color="primary" className="mb-2" />
                <Typography variant="h5" component="h1" align="center">
                  {t('auth.employeeLoginTitle') || 'Delivery Staff Login'}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  {t('auth.employeeLoginDescription') || 'Log in to access your delivery dashboard'}
                </Typography>
              </Box>
              
              {error && (
                <Box className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                  {error}
                </Box>
              )}
              
              <form onSubmit={handleSubmit}>
                <FormField
                  name="email"
                  label={t('auth.email')}
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                
                <FormField
                  name="password"
                  label={t('auth.password')}
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                
                <SubmitButton
                  loading={loading}
                  label={t('auth.loginButton')}
                />
              </form>
              
              <Box className="mt-4 text-center">
                <Typography variant="body2">
                  {t('delivery.loginHelp') || 'Contact your supermarket owner if you cannot access your account'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
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

export default DeliveryLogin; 