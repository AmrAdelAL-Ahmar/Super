import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface SubmitButtonProps {
  loading: boolean;
  label: string;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  label,
  className = '',
}) => {
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
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        className="mt-4 bg-primary-600 hover:bg-primary-700"
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          label
        )}
      </Button>
    </motion.div>
  );
};

export default SubmitButton; 