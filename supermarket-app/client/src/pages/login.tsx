import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';
import { Typography, Box, Divider } from '@mui/material';

// Import reusable components
import AuthForm from '@/components/auth/AuthForm';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';

// Import services
import { loginUser } from '@/services/authService';

const Login = () => {
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
      
      // Dispatch login action with the user data from the API
      dispatch(login({ 
        user: user
      }));
      
      // Role-based redirection
      const redirectByRole = {
        'customer': (router.query.returnUrl as string) || '/',
        'owner': '/dashboard',
        'delivery': '/delivery'
      };
      
      const destination = redirectByRole[user.role] || '/';
      router.push(destination);
      
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
  
  // Footer content with registration link
  const footerContent = (
    <>
    <Typography variant="body2">
      {t('auth.noAccount')}{' '}
      <Link href="/register" className="text-primary-600 hover:underline">
        {t('auth.register')}
      </Link>
    </Typography>
      
      <Divider className="my-4" />
      
      <Typography variant="body2" align="center">
        {t('auth.employeeAccount')}?{' '}
        <Link href="/delivery/login" className="text-primary-600 hover:underline">
          {t('auth.employeeLoginTitle')}
        </Link>
      </Typography>
    </>
  );
  
  return (
    <MainLayout>
      <AuthForm
        title={t('auth.login')}
        error={error}
        footer={footerContent}
      >
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
          
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </form>
      </AuthForm>
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

export default Login; 