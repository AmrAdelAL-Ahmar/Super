import React from 'react';
import { useRouter } from 'next/router';
import { Paper, Box, Typography, Button } from '@mui/material';
import { ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';

interface EmptyOrdersStateProps {
  className?: string;
}

const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({
  className = '',
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={2} className={`p-8 text-center ${className}`}>
        <Box className="flex justify-center mb-4">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
        </Box>
        
        <Typography variant="h5" className="mb-2">
          {t('orders.empty')}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" className="mb-6">
          {t('orders.emptyMessage')}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon className="h-5 w-5" />}
          onClick={() => router.push('/products')}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {t('cart.startShopping')}
        </Button>
      </Paper>
    </motion.div>
  );
};

export default EmptyOrdersState; 