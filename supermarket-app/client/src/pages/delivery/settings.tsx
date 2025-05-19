import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import type { DeliverySettings } from '@/types/delivery';
import { getDeliverySettings, updateDeliverySettings } from '@/services/deliveryService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function DeliverySettings() {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getDeliverySettings();
        setSettings(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [t]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

//   const handleSettingsChange = (section: keyof DeliverySettings, field: string, value: any) => {
//     if (!settings) return;

//     setSettings({
//       ...settings,
//       [section]: {
//         ...settings[section],
//         [field]: value
//       }
//     });
//   };

  const handleAccountChange = (field: string, value: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        [field]: value
      }
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
  };

  const handleNavigationChange = (field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      navigation: {
        ...settings.navigation,
        [field]: value
      }
    });
  };

  const handleLanguageChange = (value: 'en' | 'ar') => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      language: value
    });
    
    i18n.changeLanguage(value);
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      theme: value
    });
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await updateDeliverySettings(settings);
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </DeliveryLayout>
    );
  }

  if (!settings) {
    return (
      <DeliveryLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{t('common.error')}</Alert>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={() => window.location.reload()}
          >
            {t('common.retry')}
          </Button>
        </Box>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('delivery.settings.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('delivery.settings.settingsSaved')}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="settings tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={t('delivery.settings.account')} {...a11yProps(0)} />
              <Tab label={t('delivery.settings.notifications')} {...a11yProps(1)} />
              <Tab label={t('delivery.settings.navigation')} {...a11yProps(2)} />
              <Tab label={t('delivery.settings.language')} {...a11yProps(3)} />
            </Tabs>
          </Box>

          {/* Account Settings */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              {t('delivery.settings.personalInfo')}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('delivery.settings.name')}
                value={settings.account.name}
                onChange={(e) => handleAccountChange('name', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label={t('delivery.settings.phone')}
                value={settings.account.phone}
                onChange={(e) => handleAccountChange('phone', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label={t('delivery.settings.email')}
                value={settings.account.email}
                onChange={(e) => handleAccountChange('email', e.target.value)}
                margin="normal"
                type="email"
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('delivery.settings.changePassword')}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('delivery.settings.currentPassword')}
                type="password"
                margin="normal"
              />
              
              <TextField
                fullWidth
                label={t('delivery.settings.newPassword')}
                type="password"
                margin="normal"
              />
              
              <TextField
                fullWidth
                label={t('delivery.settings.confirmPassword')}
                type="password"
                margin="normal"
              />
              
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {t('delivery.settings.updatePassword')}
              </Button>
            </Box>
          </TabPanel>

          {/* Notification Settings */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              {t('delivery.settings.notificationSettings')}
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.pushEnabled}
                    onChange={(e) => handleNotificationChange('pushEnabled', e.target.checked)}
                  />
                }
                label={t('delivery.settings.pushNotifications')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => handleNotificationChange('emailEnabled', e.target.checked)}
                  />
                }
                label={t('delivery.settings.emailNotifications')}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.newOrderAlerts}
                    onChange={(e) => handleNotificationChange('newOrderAlerts', e.target.checked)}
                    disabled={!settings.notifications.pushEnabled}
                  />
                }
                label={t('delivery.settings.newOrderAlerts')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                    disabled={!settings.notifications.pushEnabled}
                  />
                }
                label={t('delivery.settings.orderUpdates')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.systemAnnouncements}
                    onChange={(e) => handleNotificationChange('systemAnnouncements', e.target.checked)}
                    disabled={!settings.notifications.pushEnabled}
                  />
                }
                label={t('delivery.settings.systemAnnouncements')}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.soundAlerts}
                    onChange={(e) => handleNotificationChange('soundAlerts', e.target.checked)}
                  />
                }
                label={t('delivery.settings.soundAlerts')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.vibration}
                    onChange={(e) => handleNotificationChange('vibration', e.target.checked)}
                  />
                }
                label={t('delivery.settings.vibration')}
              />
            </FormGroup>
          </TabPanel>

          {/* Navigation Settings */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              {t('delivery.settings.navigationSettings')}
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="maps-app-label">{t('delivery.settings.preferredMaps')}</InputLabel>
              <Select
                labelId="maps-app-label"
                value={settings.navigation.preferredMapsApp}
                onChange={(e) => handleNavigationChange('preferredMapsApp', e.target.value)}
                label={t('delivery.settings.preferredMaps')}
              >
                <MenuItem value="google">Google Maps</MenuItem>
                <MenuItem value="apple">Apple Maps</MenuItem>
                <MenuItem value="waze">Waze</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>
            
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.navigation.avoidTolls}
                    onChange={(e) => handleNavigationChange('avoidTolls', e.target.checked)}
                  />
                }
                label={t('delivery.settings.avoidTolls')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.navigation.avoidHighways}
                    onChange={(e) => handleNavigationChange('avoidHighways', e.target.checked)}
                  />
                }
                label={t('delivery.settings.avoidHighways')}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.navigation.nightMode}
                    onChange={(e) => handleNavigationChange('nightMode', e.target.checked)}
                  />
                }
                label={t('delivery.settings.nightMode')}
              />
            </FormGroup>
          </TabPanel>

          {/* Language and Theme */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              {t('delivery.settings.language')}
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="language-label">{t('delivery.settings.language')}</InputLabel>
              <Select
                labelId="language-label"
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'ar')}
                label={t('delivery.settings.language')}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              {t('delivery.settings.theme')}
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="theme-label">{t('delivery.settings.theme')}</InputLabel>
              <Select
                labelId="theme-label"
                value={settings.theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
                label={t('delivery.settings.theme')}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </TabPanel>
        </Paper>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('delivery.settings.saveSettings')
            )}
          </Button>
        </Box>
      </Box>
    </DeliveryLayout>
  );
} 
export async function getServerSideProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }
  