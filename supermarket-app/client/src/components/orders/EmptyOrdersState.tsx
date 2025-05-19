import React from 'react';
import { useRouter } from 'next/router';
import { Paper, Box, Typography, Button } from '@mui/material';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
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
      className={className}
    >
      <Paper elevation={0} className="p-8 text-center">
        <Box className="flex flex-col items-center">
          <Box className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBagIcon className="h-10 w-10 text-gray-400" />
          </Box>
          
          <Typography variant="h5" className="font-bold mb-2">
            {t('orders.emptyState.title')}
          </Typography>
          
          <Typography variant="body1" color="textSecondary" className="mb-6">
            {t('orders.emptyState.description')}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/products')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {t('orders.emptyState.browseProducts')}
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EmptyOrdersState; 