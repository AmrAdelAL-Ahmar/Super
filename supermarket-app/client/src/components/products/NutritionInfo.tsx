import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow 
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ProductNutrition } from '@/types/product';

interface NutritionInfoProps {
  nutrition: ProductNutrition;
  className?: string;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({
  nutrition,
  className = '',
}) => {
  const { t } = useTranslation('common');
  
  // Nutrition data for display
  const nutritionData = [
    { name: t('products.calories'), value: `${nutrition.calories} kcal` },
    { name: t('products.protein'), value: `${nutrition.protein} g` },
    { name: t('products.carbs'), value: `${nutrition.carbs} g` },
    { name: t('products.fat'), value: `${nutrition.fat} g` },
    { name: t('products.fiber', 'Fiber'), value: `${nutrition.fiber} g` },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Typography variant="h6" className="font-bold mb-4">
        {t('products.nutritionalValues')}
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {nutritionData.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2}>
        <Typography variant="caption" color="textSecondary">
          {t('products.nutritionDisclaimer')}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default NutritionInfo; 