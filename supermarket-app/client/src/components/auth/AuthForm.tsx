import React, { ReactNode } from 'react';
import { Paper, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';

interface AuthFormProps {
  title: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, error, children, footer }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <div className="py-10 px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Paper elevation={3} className="p-8">
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" className="text-center text-primary-600 mb-6">
              {title}
            </Typography>
          </motion.div>
          
          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            </motion.div>
          )}
          
          {children}
          
          {footer && (
            <motion.div variants={itemVariants} className="mt-6 text-center">
              {footer}
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </div>
  );
};

export default AuthForm; 