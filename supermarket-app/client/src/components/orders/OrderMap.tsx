import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

interface Location {
  lat: number;
  lng: number;
}

interface OrderMapProps {
  customerLocation: Location;
  storeLocation: Location;
  driverLocation?: Location;
  isDelivering: boolean;
  className?: string;
}

const OrderMap: React.FC<OrderMapProps> = ({
  customerLocation,
  storeLocation,
  driverLocation,
  isDelivering,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  
  // Load Google Maps API
  useEffect(() => {
    // This would normally load the Google Maps API
    // For now, we'll simulate the loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      
      // Simulate calculating route time
      if (isDelivering && driverLocation) {
        const distance = calculateDistance(driverLocation, customerLocation);
        const minutes = Math.round(distance * 3); // Rough estimate: 3 minutes per km
        setEstimatedTime(`${minutes} ${t('common.minutes')}`);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [customerLocation, storeLocation, driverLocation, isDelivering]);
  
  // Calculate distance between two points (simplified version)
  const calculateDistance = (point1: Location, point2: Location): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(point2.lat - point1.lat);
    const dLng = deg2rad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Paper elevation={1} className="p-4">
        <Typography variant="h6" className="font-medium mb-3">
          {isDelivering 
            ? t('order.deliveryInProgress') 
            : t('order.deliveryLocation')}
        </Typography>
        
        {!mapLoaded ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <Box 
            ref={mapRef} 
            className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden"
            sx={{ 
              backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${customerLocation.lat},${customerLocation.lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${customerLocation.lat},${customerLocation.lng}&key=YOUR_API_KEY')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* This would be replaced with actual Google Maps implementation */}
            <Box className="absolute inset-0 flex items-center justify-center">
              <Typography variant="body2" className="bg-white bg-opacity-75 p-2 rounded">
                {t('order.mapPlaceholder')}
              </Typography>
            </Box>
          </Box>
        )}
        
        {isDelivering && driverLocation && estimatedTime && (
          <Box className="mt-3 p-3 bg-primary-50 rounded-lg">
            <Typography variant="body1" className="font-medium text-primary-700">
              {t('order.estimatedArrival')}: {estimatedTime}
            </Typography>
            <Typography variant="body2" className="text-primary-600">
              {t('order.driverOnTheWay')}
            </Typography>
          </Box>
        )}
        
        <Box className="mt-3">
          <Typography variant="body2" className="font-medium">
            {t('order.deliveryAddress')}:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            123 Main Street, Apt 4B, New York, NY 10001
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default OrderMap; 