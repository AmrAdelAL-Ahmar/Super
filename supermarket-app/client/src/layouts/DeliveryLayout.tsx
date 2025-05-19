import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Avatar, Menu, MenuItem, Badge } from '@mui/material';
import { 
  HomeIcon, 
  TruckIcon, 
  ClockIcon, 
  MapIcon, 
  StarIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { getDeliveryNotifications } from '@/services/deliveryService';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { RootState } from '@/store';
import { logoutUser } from '@/services/authService';

interface DeliveryLayoutProps {
  children: ReactNode;
}

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    // Check if user is logged in and has delivery role
    if (!user) {
      router.push('/delivery/login?returnUrl=' + router.pathname);
      return;
    }

    if (user.role !== 'delivery') {
      router.push('/');
      return;
    }
    
    const fetchNotifications = async () => {
      try {
        const notifications = await getDeliveryNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // In a real app, you would set up a websocket or polling here
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, router]);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const menuItems = [
    { text: t('delivery.dashboard'), icon: <HomeIcon className="h-6 w-6" />, path: '/delivery' },
    { text: t('delivery.activeDelivery'), icon: <TruckIcon className="h-6 w-6" />, path: '/delivery/orders/active' },
    { text: t('delivery.history.title'), icon: <ClockIcon className="h-6 w-6" />, path: '/delivery/history' },
    { text: t('delivery.map'), icon: <MapIcon className="h-6 w-6" />, path: '/delivery/map' },
    { text: t('delivery.ratings.title'), icon: <StarIcon className="h-6 w-6" />, path: '/delivery/ratings' },
  ];
  
  const drawer = (
    <div>
      <Box className="p-4 flex items-center justify-between">
        <Typography variant="h6" className="font-bold">
          {t('app.name')}
        </Typography>
        <IconButton onClick={handleDrawerToggle} className="md:hidden">
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} key={item.text} passHref legacyBehavior>
            <ListItem 
              button 
              component="a"
              selected={router.pathname === item.path}
              className={router.pathname === item.path ? 'bg-primary-50 text-primary-600' : ''}
            >
              <ListItemIcon className={router.pathname === item.path ? 'text-primary-600' : ''}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          onClick={() => router.push('/delivery/settings')}
        >
          <ListItemIcon>
            <Cog6ToothIcon className="h-6 w-6" />
          </ListItemIcon>
          <ListItemText primary={t('delivery.settings.title')} />
        </ListItem>
        <ListItem 
          button 
          onClick={handleLogout}
        >
          <ListItemIcon>
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </ListItemIcon>
          <ListItemText primary={t('navigation.logout')} />
        </ListItem>
      </List>
    </div>
  );
  
  const drawerWidth = 240;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        color="default"
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton
            color="inherit"
            aria-label="notifications"
            onClick={() => router.push('/delivery/notifications')}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <BellIcon className="h-6 w-6" />
            </Badge>
          </IconButton>
          
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar alt="Delivery Person" src="/images/avatar.jpg" />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => router.push('/delivery/profile')}>
              <UserCircleIcon className="h-5 w-5 mr-2" />
              {t('profile.title')}
            </MenuItem>
            <MenuItem onClick={() => router.push('/delivery/settings')}>
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              {t('delivery.settings.title')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              {t('navigation.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DeliveryLayout; 