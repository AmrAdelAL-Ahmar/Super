import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Paper, Button, 
  CircularProgress, IconButton, Alert, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';
import { RootState } from '@/store';
import { NewEmployeeData } from '@/types/user';

const AddEmployeePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<NewEmployeeData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'delivery'
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard/employees/new');
      return;
    }

    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    setLoading(false);
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('owner.invalidEmail') || 'Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError(t('owner.passwordTooShort') || 'Password must be at least 6 characters');
      return false;
    }

    // Password confirmation
    if (formData.password !== confirmPassword) {
      setError(t('auth.passwordMismatch') || 'Passwords do not match');
      return false;
    }

    // Phone validation
    if (formData.phone.length < 5) {
      setError(t('owner.invalidPhone') || 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // This would typically be an API call to your backend
      // const response = await axios.post('/api/employees', formData);
      
      // Mock successful response for now
      console.log('Creating employee:', formData);
      
      // Redirect back to employee list with success message
      router.push({
        pathname: '/dashboard/employees',
        query: { success: 'Employee created successfully' }
      });
    } catch (err: any) {
      // Handle API errors
      if (err.response) {
        setError(err.response.data?.error || t('owner.createEmployeeError') || 'Failed to create employee');
      } else {
        setError(t('owner.createEmployeeError') || 'Failed to create employee');
      }
      console.error('Error creating employee:', err);
    } finally {
      setSubmitting(false);
    }
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
      <Box className="max-w-3xl mx-auto py-8 px-4">
        <Box className="flex items-center mb-6">
          <IconButton onClick={() => router.push('/dashboard/employees')} className="mr-2">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('owner.addEmployee')}
          </Typography>
        </Box>

        <Paper elevation={3} className="p-6">
          <Typography variant="h6" className="mb-4">
            {t('owner.employeeDetails') || 'Employee Details'}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" className="mb-4">
            {t('owner.employeeInstructions') || 'Fill in the details below to create a new delivery employee account. The employee will be able to log in using these credentials.'}
          </Typography>
          
          <Divider className="mb-4" />
          
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <FormField
              name="name"
              label={t('auth.name') || 'Full Name'}
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <FormField
              name="email"
              label={t('auth.email') || 'Email Address'}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <FormField
              name="phone"
              label={t('auth.phone') || 'Phone Number'}
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <FormField
              name="password"
              label={t('auth.password') || 'Password'}
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <FormField
              name="confirmPassword"
              label={t('auth.confirmPassword') || 'Confirm Password'}
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
            
            <Box className="mt-6 flex justify-end">
              <Button 
                onClick={() => router.push('/dashboard/employees')}
                className="mr-2"
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              
              <SubmitButton
                loading={submitting}
                label={t('owner.createEmployee') || 'Create Employee'}
              />
            </Box>
          </form>
        </Paper>
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

export default AddEmployeePage; 