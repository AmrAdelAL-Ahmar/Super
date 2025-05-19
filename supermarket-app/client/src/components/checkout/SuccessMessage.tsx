import React from 'react';
import { Typography } from '@mui/material';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  icon = <CheckCircleIcon className="h-24 w-24 mx-auto text-green-500 mb-6" />,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Typography variant="h3" component="h1" className="font-bold mb-3">
          {title}
        </Typography>
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Typography variant="h6" className="text-gray-600 mb-8">
            {message}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SuccessMessage; 