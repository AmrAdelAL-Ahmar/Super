import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid
} from '@mui/material';
import { 
  MapPinIcon, 
  ArrowLeftIcon, 
  MagnifyingGlassIcon, 
  HomeIcon, 
  BuildingStorefrontIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { Location } from '@/types/delivery';

interface MapLocation extends Location {
  label?: string;
  address?: string;
  type?: 'customer' | 'store' | 'current';
}

const DeliveryMapPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [destinations, setDestinations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  
  // Get query parameters (lat, lng) if provided
  useEffect(() => {
    const { lat, lng, label, type } = router.query;
    
    if (lat && lng) {
      const destination: MapLocation = {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        label: label as string || t('delivery.destination', 'Destination') || "",
        type: (type as 'customer' | 'store') || 'customer'
      };
      
      setDestinations([destination]);
      setSelectedLocation(destination);
    }
    
    // Get current location (in a real app, this would use the Geolocation API)
    // For now, we'll use a mock location
    setCurrentLocation({
      lat: 30.0444,
      lng: 31.2357,
      label: t('delivery.currentLocation', 'Current Location') || "",
      type: 'current'
    });
    
    // Mock destinations (in a real app, these would come from the API)
    if (!lat && !lng) {
      setDestinations([
        {
          lat: 30.0500,
          lng: 31.2300,
          label: 'SuperMart Downtown',
          address: '456 Market St, Cairo',
          type: 'store'
        },
        {
          lat: 30.0600,
          lng: 31.2200,
          label: 'Sara Ahmed',
          address: '123 Main St, Apartment 4B, Cairo',
          type: 'customer'
        },
        {
          lat: 30.0700,
          lng: 31.2400,
          label: 'SuperMart Heliopolis',
          address: '789 Heliopolis Blvd, Cairo',
          type: 'store'
        }
      ]);
    }
    
    setLoading(false);
  }, [router.query, t]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for locations
    console.log('Searching for:', searchQuery);
  };
  
  const handleSelectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
    
    // In a real app, this would center the map on the selected location
    console.log('Selected location:', location);
  };
  
  const handleStartNavigation = () => {
    if (selectedLocation) {
      // In a real app, this would start navigation to the selected location
      // For now, we'll just show an alert
      alert(`Starting navigation to ${selectedLocation.label}`);
    }
  };
  
  return (
    <DeliveryLayout>
      <Container maxWidth="lg" className="py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="flex items-center mb-6">
            <Button
              startIcon={<ArrowLeftIcon className="h-5 w-5" />}
              onClick={handleBack}
              className="mr-4"
            >
              {t('delivery.back', 'Back')}
            </Button>
            <Typography variant="h5" component="h1" className="font-bold">
              {t('delivery.map', 'Map')}
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Map */}
            <Grid item xs={12} md={8}>
              <Paper elevation={1} className="overflow-hidden">
                {loading ? (
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    height={500}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box 
                    ref={mapRef} 
                    className="w-full h-[500px] bg-gray-100 relative"
                    sx={{ 
                      backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${
                        selectedLocation ? `${selectedLocation.lat},${selectedLocation.lng}` : '30.0444,31.2357'
                      }&zoom=13&size=800x500&maptype=roadmap&markers=color:red%7C${
                        selectedLocation ? `${selectedLocation.lat},${selectedLocation.lng}` : '30.0444,31.2357'
                      }&key=YOUR_API_KEY')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* This would be replaced with actual Google Maps implementation */}
                    <Box className="absolute inset-0 flex items-center justify-center">
                      <Typography variant="body2" className="bg-white bg-opacity-75 p-2 rounded">
                        {t('delivery.mapPlaceholder', 'Map would be displayed here')}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {selectedLocation && (
                  <Box className="p-4">
                    <Typography variant="h6" className="font-medium mb-2">
                      {selectedLocation.label}
                    </Typography>
                    
                    {selectedLocation.address && (
                      <Typography variant="body2" color="textSecondary" className="mb-4">
                        {selectedLocation.address}
                      </Typography>
                    )}
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleStartNavigation}
                      startIcon={<MapPinIcon className="h-5 w-5" />}
                    >
                      {t('delivery.startNavigation', 'Start Navigation')}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Locations */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} className="p-4">
                <form onSubmit={handleSearch} className="mb-4">
                  <TextField
                    fullWidth
                    placeholder={t('delivery.searchLocation', 'Search location...') || ''}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button type="submit" size="small">
                            {t('common.search', 'Search')}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
                
                <Typography variant="h6" className="font-medium mb-2">
                  {t('delivery.locations', 'Locations')}
                </Typography>
                
                <List disablePadding>
                  {currentLocation && (
                    <>
                      <ListItem 
                        button 
                        selected={selectedLocation === currentLocation}
                        onClick={() => handleSelectLocation(currentLocation)}
                        className={selectedLocation === currentLocation ? 'bg-primary-50' : ''}
                      >
                        <ListItemIcon>
                          <MapPinIcon className="h-6 w-6 text-blue-500" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={currentLocation.label} 
                          secondary={t('delivery.yourLocation', 'Your Location')}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </>
                  )}
                  
                  {destinations.map((location, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        button 
                        selected={selectedLocation === location}
                        onClick={() => handleSelectLocation(location)}
                        className={selectedLocation === location ? 'bg-primary-50' : ''}
                      >
                        <ListItemIcon>
                          {location.type === 'store' ? (
                            <BuildingStorefrontIcon className="h-6 w-6 text-green-500" />
                          ) : (
                            <HomeIcon className="h-6 w-6 text-red-500" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={location.label} 
                          secondary={location.address}
                        />
                      </ListItem>
                      {index < destinations.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </DeliveryLayout>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default DeliveryMapPage; 