import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { OrderItem } from '@/types/order';

interface OrderItemsListProps {
  items: OrderItem[];
  title?: string;
  className?: string;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  title,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <Card variant="outlined" className={className}>
      {title && (
        <Box className="p-4 border-b">
          <Typography variant="h6" className="font-bold">
            {title}
          </Typography>
        </Box>
      )}
      
      <CardContent>
        <Box className="space-y-3">
          {items.map((item) => (
            <Box key={item.id} className="flex items-center space-x-4">
              {item.image && (
                <Box className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={locale === 'ar' ? item.nameAr : item.name} 
                    className="w-full h-full object-cover"
                  />
                </Box>
              )}
              
              <Box className="flex-grow">
                <Typography variant="subtitle1">
                  {locale === 'ar' ? item.nameAr : item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.quantity} x ${item.price?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" className="font-medium">
                ${((item.price || 0) * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderItemsList; 