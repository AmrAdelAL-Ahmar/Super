import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Paper, Tabs, Tab, Alert, Button } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';
import { RootState } from '@/store';
import { updateUser } from '@/features/auth/authSlice';
import { updateUserProfile, updatePassword } from '@/services/authService';
// TODO: Fix type issues to use these imports. Current issues with optional types:
// import { ProfileUpdateData, PasswordUpdateData, User } from '@/types/user';

/**
 * TabPanel component for profile tabs
 */
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

/**
 * ProfilePage component for user profile management
 */
const ProfilePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Form data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Initialize profile data when user is loaded
  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/profile');
      return;
    }
    
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, [user, router]);
  
  /**
   * Handle tab change
   */
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
    setSuccess('');
    setError('');
  };
  
  /**
   * Navigate to addresses page
   */
  const navigateToAddresses = () => {
    router.push('/profile/addresses');
  };
  
  /**
   * Handle profile form changes
   */
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  /**
   * Handle password form changes
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  /**
   * Submit profile update form
   */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const updatedUser = await updateUserProfile(profileData);
      dispatch(updateUser(updatedUser));
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Submit password update form
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setSuccess(t('profile.passwordUpdateSuccess') || 'Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError(t('profile.currentPasswordIncorrect') || 'Current password is incorrect');
      } else if (err.response) {
        setError(err.response.data?.error || t('profile.passwordUpdateError') || 'Failed to update password');
      } else {
        setError(t('profile.passwordUpdateError') || 'Failed to update password');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect to login if no user is found
  if (!user) {
    return null; // Will redirect to login in useEffect
  }
  
  return (
    <MainLayout>
      <Box className="max-w-2xl mx-auto py-8 px-4">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t('profile.title') || 'My Profile'}
        </Typography>
        
        {/* Address Management Button */}
        <Box className="mb-4 flex justify-end">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LocationIcon />}
            onClick={navigateToAddresses}
          >
            {t('profile.manageAddresses') || 'Manage Addresses'}
          </Button>
        </Box>
        
        <Paper elevation={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label={t('profile.personalInfo') || 'Personal Information'} />
            <Tab label={t('profile.changePassword') || 'Change Password'} />
          </Tabs>
          
          {/* Personal Info Tab */}
          <TabPanel value={activeTab} index={0}>
            {success && <Alert severity="success" className="mb-4">{success}</Alert>}
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}
            
            <form onSubmit={handleProfileSubmit}>
              <FormField
                name="name"
                label={t('auth.name') || 'Name'}
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
              
              <FormField
                name="email"
                label={t('auth.email') || 'Email'}
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
              
              <FormField
                name="phone"
                label={t('auth.phone') || 'Phone'}
                type="tel"
                value={profileData.phone}
                onChange={handleProfileChange}
                required
              />
              
              <Box className="mt-6">
                <SubmitButton
                  loading={loading}
                  label={t('profile.updateProfile') || 'Update Profile'}
                />
              </Box>
            </form>
          </TabPanel>
          
          {/* Change Password Tab */}
          <TabPanel value={activeTab} index={1}>
            {success && <Alert severity="success" className="mb-4">{success}</Alert>}
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}
            
            <form onSubmit={handlePasswordSubmit}>
              <FormField
                name="currentPassword"
                label={t('profile.currentPassword') || 'Current Password'}
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              
              <FormField
                name="newPassword"
                label={t('profile.newPassword') || 'New Password'}
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
              
              <FormField
                name="confirmPassword"
                label={t('profile.confirmNewPassword') || 'Confirm New Password'}
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              
              <Box className="mt-6">
                <SubmitButton
                  loading={loading}
                  label={t('profile.changePassword') || 'Change Password'}
                />
              </Box>
            </form>
          </TabPanel>
        </Paper>
        
        {/* Address Management Section */}
        <Paper elevation={3} className="mt-6 p-4">
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              {t('profile.deliveryAddresses') || 'Delivery Addresses'}
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<LocationIcon />}
              onClick={navigateToAddresses}
            >
              {t('profile.manageAddresses') || 'Manage Addresses'}
            </Button>
          </Box>
          
          <Typography variant="body2" className="mt-2">
            {t('profile.addressesDescription') || 'Manage your delivery addresses to speed up checkout.'}
          </Typography>
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

export default ProfilePage; 