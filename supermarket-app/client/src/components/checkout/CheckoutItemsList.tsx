import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { CartItem } from '@/types/cart';

interface CheckoutItemsListProps {
  items: CartItem[];
  className?: string;
}

const CheckoutItemsList: React.FC<CheckoutItemsListProps> = ({
  items,
  className = ''
}) => {
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <Box className={`max-h-80 overflow-auto mb-4 ${className}`}>
      {items.map((item) => (
        <Box key={item.id} className="flex items-center mb-3 pb-3 border-b">
          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
            <img 
              src={item.image} 
              alt={locale === 'ar' ? item.nameAr : item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <Typography variant="body1" className="font-medium">
              {locale === 'ar' ? item.nameAr : item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.quantity} x ${item.price.toFixed(2)}
            </Typography>
          </div>
          <Typography variant="body1" className="font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CheckoutItemsList; 