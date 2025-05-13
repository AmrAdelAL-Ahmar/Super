import React from 'react';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  autoComplete,
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
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        margin="normal"
        required={required}
        variant="outlined"
        autoComplete={autoComplete}
      />
    </motion.div>
  );
};

export default FormField; 