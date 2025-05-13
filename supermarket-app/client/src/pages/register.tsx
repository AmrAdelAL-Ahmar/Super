import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';

// Import reusable components
import AuthForm from '@/components/auth/AuthForm';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';

// Import services
import { registerUser } from '@/services/authService';

const Register = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch')||"");
      setLoading(false);
      return;
    }
    
    if (!formData.agreeTerms) {
      setError(t('auth.agreeTermsRequired')||"");
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, this would call the registerUser service
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dispatch login action (would normally be done after API call)
      dispatch(login({ 
        user: { 
          id: '1', 
          email: formData.email,
          name: formData.name, 
          role: 'customer' 
        } 
      }));
      
      router.push('/');
    } catch (err) {
      setError(t('auth.registerError')||"");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Footer content with login link
  const footerContent = (
    <Typography variant="body2">
      {t('auth.haveAccount')}{' '}
      <Link href="/login" className="text-primary-600 hover:underline">
        {t('auth.login')}
      </Link>
    </Typography>
  );
  
  return (
    <MainLayout>
      <AuthForm
        title={t('auth.register')}
        error={error}
        footer={footerContent}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            name="name"
            label={t('auth.name')}
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
          
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
            autoComplete="new-password"
          />
          
          <FormField
            name="confirmPassword"
            label={t('auth.confirmPassword')}
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          
          <div className="mt-2">
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <span>
                  {t('auth.agreeTerms')}{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    {t('auth.termsLink')}
                  </Link>
                </span>
              }
            />
          </div>
          
          <SubmitButton
            loading={loading}
            label={t('auth.registerButton')}
          />
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

export default Register; 