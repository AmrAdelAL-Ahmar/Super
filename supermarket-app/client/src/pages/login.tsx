import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';
import { Typography } from '@mui/material';

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
      // In a real app, this would call the loginUser service
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dispatch login action (would normally be done after API call)
      dispatch(login({ 
        user: { 
          id: '1', 
          email: formData.email,
          name: 'User Name', 
          role: 'customer' 
        } 
      }));
      
      router.push('/');
    } catch (err) {
      setError(t('auth.loginError')||"");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Footer content with registration link
  const footerContent = (
    <Typography variant="body2">
      {t('auth.noAccount')}{' '}
      <Link href="/register" className="text-primary-600 hover:underline">
        {t('auth.register')}
      </Link>
    </Typography>
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