import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface EmptyCartProps {
  onShopNow?: () => void;
  className?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  onShopNow,
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    } else {
      router.push('/products');
    }
  };
  
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.div variants={itemVariants} className={className}>
      <Paper elevation={2} className="p-8 text-center">
        <Box className="flex justify-center mb-4">
          <ShoppingCartIcon className="h-16 w-16 text-gray-400" />
        </Box>
        
        <Typography variant="h5" className="mb-2">
          {t('cart.empty')}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" className="mb-6">
          {t('cart.emptyMessage')}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleShopNow}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {t('cart.startShopping')}
        </Button>
      </Paper>
    </motion.div>
  );
};

export default EmptyCart; 