import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import MainLayout from '@/layouts/MainLayout';
import { TextField, Button, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

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
      // In a real app, you would make an API call to your backend
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
      <div className="py-10 px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Paper elevation={3} className="p-8">
            <motion.div variants={itemVariants}>
              <Typography variant="h4" component="h1" className="text-center text-primary-600 mb-6">
                {t('auth.login')}
              </Typography>
            </motion.div>
            
            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label={t('auth.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label={t('auth.password')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  className="mt-4 bg-primary-600 hover:bg-primary-700"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('auth.loginButton')
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div variants={itemVariants} className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <Typography variant="body2">
                {t('auth.noAccount')}{' '}
                <Link href="/register" className="text-primary-600 hover:underline">
                  {t('auth.register')}
                </Link>
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </div>
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