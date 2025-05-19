import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { OrderStatus } from '@/types/order';

interface OrderCardProps {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  itemsCount: number;
  className?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  status,
  date,
  total,
  itemsCount,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const isRTL = locale === 'ar';
  
  // Get status color
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'delivered': return 'success';
      case 'outForDelivery': return 'primary';
      case 'processing': return 'info';
      case 'confirmed': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="outlined" className="hover:border-primary-300 transition-colors">
        <CardContent>
          <Box className="flex justify-between items-start mb-3">
            <Box>
              <Typography variant="h6" className="font-medium">
                {id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {date}
              </Typography>
            </Box>
            
            <Chip 
              label={t(`order.status.${status}`, status)} 
              color={getStatusColor(status) as any} 
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Divider className="my-3" />
          
          <Box className="flex justify-between items-center mb-3">
            <Typography variant="body2" color="textSecondary">
              {t('order.items', 'Items')}: {itemsCount}
            </Typography>
            <Typography variant="h6" className="font-bold">
              ${total.toFixed(2)}
            </Typography>
          </Box>
          
          <Link href={`/orders/${id}`} passHref legacyBehavior>
            <Button 
              variant="outlined" 
              fullWidth
              component="a"
              endIcon={isRTL ? <ArrowLeftIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
              className="mt-2"
            >
              {t('order.viewDetails', 'View Details')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderCard; 