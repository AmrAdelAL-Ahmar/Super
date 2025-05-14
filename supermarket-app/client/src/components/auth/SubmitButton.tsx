import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

export interface SubmitButtonProps {
  loading: boolean;
  label: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  className?: string;
}

const SubmitButton = ({ 
  loading, 
  label, 
  variant = 'contained', 
  color = 'primary', 
  className = '' 
}: SubmitButtonProps) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.div variants={itemVariants} className={className}>
      <Button
        type="submit"
        variant={variant}
        color={color}
        disabled={loading}
        fullWidth
        className={`mt-4 ${className}`}
      >
        {loading ? <CircularProgress size={24} /> : label}
      </Button>
    </motion.div>
  );
};

export default SubmitButton; 