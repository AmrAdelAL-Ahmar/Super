import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  ShoppingBag as OrderIcon,
  Cancel as CancelIcon,
  Update as UpdateIcon,
  Announcement as AnnouncementIcon,
  CheckCircle as ReadIcon
} from '@mui/icons-material';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { Notification } from '@/types/delivery';
import { getDeliveryNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/deliveryService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function DeliveryNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getDeliveryNotifications();
        setNotifications(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [t]);

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return t('delivery.notifications.justNow');
    if (diffMins < 60) return t('delivery.notifications.minutesAgo', { minutes: diffMins });
    if (diffHours < 24) return t('delivery.notifications.hoursAgo', { hours: diffHours });
    return t('delivery.notifications.daysAgo', { days: diffDays });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <OrderIcon />;
      case 'order_cancelled':
        return <CancelIcon />;
      case 'order_updated':
        return <UpdateIcon />;
      case 'system':
        return <AnnouncementIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'new_order':
        return 'primary.main';
      case 'order_cancelled':
        return 'error.main';
      case 'order_updated':
        return 'info.main';
      case 'system':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const success = await markNotificationAsRead(notificationId);
      
      if (success) {
        setNotifications(notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        ));
      }
    } catch (err) {
      // Handle error silently
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    
    try {
      const success = await markAllNotificationsAsRead();
      
      if (success) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  if (loading) {
    return (
      <DeliveryLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            {t('delivery.notifications.title')}
            {unreadCount > 0 && (
              <Badge 
                badgeContent={unreadCount} 
                color="error" 
                sx={{ ml: 2 }}
              >
                <NotificationsActiveIcon color="action" />
              </Badge>
            )}
          </Typography>
          
          {unreadCount > 0 && (
            <Button 
              variant="outlined" 
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              startIcon={markingAll ? <CircularProgress size={20} /> : <ReadIcon />}
            >
              {t('delivery.notifications.markAllAsRead')}
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {notifications.length > 0 ? (
          <Paper>
            <List>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      !notification.read && (
                        <Tooltip title={t('common.mark') as string}>
                          <IconButton edge="end" onClick={() => handleMarkAsRead(notification.id)}>
                            <ReadIcon />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getIconColor(notification.type) }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="subtitle1"
                          fontWeight={notification.read ? 'normal' : 'bold'}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            display="block"
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {getTimeAgo(notification.timestamp)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('delivery.notifications.noNotifications')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('delivery.notifications.noNotificationsDescription')}
            </Typography>
          </Paper>
        )}
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
  