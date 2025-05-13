import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

interface ActionButton {
  label: string;
  href: string;
  variant: 'text' | 'outlined' | 'contained';
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: () => void;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  className?: string;
  direction?: 'row' | 'column';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  className = '',
  direction = 'row',
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={`flex flex-col ${direction === 'row' ? 'sm:flex-row' : ''} justify-center gap-4 ${className}`}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          component={Link}
          href={button.href}
          startIcon={button.icon}
          color={button.color || 'primary'}
          size="large"
          onClick={button.onClick}
          className={button.variant === 'contained' ? 'bg-primary-600 hover:bg-primary-700' : ''}
        >
          {button.label}
        </Button>
      ))}
    </motion.div>
  );
};

export default ActionButtons; 