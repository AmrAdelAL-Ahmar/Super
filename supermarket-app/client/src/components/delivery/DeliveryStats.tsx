import React from 'react';
import { useTranslation } from 'next-i18next';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider,
  LinearProgress,
  Rating
} from '@mui/material';
import { 
  TruckIcon, 
  StarIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { DeliveryPerson } from '@/types/delivery';

type DeliveryStatsProps = Pick<
  DeliveryPerson,
  'ratings' | 'totalDeliveries' | 'completedToday' | 'earnings'
>;

const DeliveryStats: React.FC<DeliveryStatsProps> = ({
  ratings,
  totalDeliveries,
  completedToday,
  earnings
}) => {
  const { t } = useTranslation('common');
  
  return (
    <Box>
      {/* Ratings */}
      <Box className="mb-4">
        <Box className="flex items-center mb-2">
          <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <Typography variant="body1" className="font-medium">
            {t('delivery.stats.ratings')}
          </Typography>
        </Box>
        <Box className="flex items-center ml-7">
          <Typography variant="h5" className="font-bold mr-2">
            {ratings.toFixed(1)}
          </Typography>
          <Rating 
            value={ratings} 
            precision={0.1} 
            readOnly 
            size="small"
          />
        </Box>
      </Box>
      
      <Divider className="my-3" />
      
      {/* Deliveries */}
      <Box className="mb-4">
        <Box className="flex items-center mb-2">
          <TruckIcon className="h-5 w-5 text-primary-500 mr-2" />
          <Typography variant="body1" className="font-medium">
            {t('delivery.stats.deliveries')}
          </Typography>
        </Box>
        <Grid container spacing={2} className="ml-6">
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              {t('delivery.stats.total')}
            </Typography>
            <Typography variant="h6" className="font-bold">
              {totalDeliveries}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              {t('delivery.stats.today')}
            </Typography>
            <Typography variant="h6" className="font-bold">
              {completedToday}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Divider className="my-3" />
      
      {/* Earnings */}
      <Box>
        <Box className="flex items-center mb-2">
          <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
          <Typography variant="body1" className="font-medium">
            {t('delivery.stats.earnings')}
          </Typography>
        </Box>
        
        <Box className="ml-7 mb-2">
          <Box className="flex justify-between mb-1">
            <Typography variant="body2" color="textSecondary">
              {t('delivery.stats.today')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              ${earnings.today.toFixed(2)}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(earnings.today / 100) * 100} 
            className="mb-2" 
            color="success"
          />
        </Box>
        
        <Box className="ml-7 mb-2">
          <Box className="flex justify-between mb-1">
            <Typography variant="body2" color="textSecondary">
              {t('delivery.stats.week')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              ${earnings.week.toFixed(2)}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(earnings.week / 500) * 100} 
            className="mb-2" 
            color="primary"
          />
        </Box>
        
        <Box className="ml-7">
          <Box className="flex justify-between mb-1">
            <Typography variant="body2" color="textSecondary">
              {t('delivery.stats.month')}
            </Typography>
            <Typography variant="body2" className="font-medium">
              ${earnings.month.toFixed(2)}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(earnings.month / 2000) * 100} 
            className="mb-2" 
            color="secondary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryStats; 