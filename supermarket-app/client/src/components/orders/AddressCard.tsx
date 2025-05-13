import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { ShippingAddress } from '@/types/order';
import { useRouter } from 'next/router';

interface AddressCardProps {
  address: ShippingAddress;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  title,
  icon = <MapPinIcon className="h-5 w-5 mr-2 text-primary-600" />,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <Card variant="outlined" className={className}>
      <Box className="p-4 border-b flex items-center">
        {icon}
        <Typography variant="h6" className="font-bold">
          {title || t('order.deliveryAddress')}
        </Typography>
      </Box>
      
      <CardContent>
        <Typography variant="subtitle1">
          {locale === 'ar' ? address.nameAr : address.name}
        </Typography>
        <Typography variant="body1">
          {address.recipient}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {address.street}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {address.city}, {address.state} {address.zipCode}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-1">
          {address.phone}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AddressCard; 