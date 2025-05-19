import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { motion } from 'framer-motion';

export interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  fullWidth?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormField = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
  className = '',
  fullWidth = false,
  inputProps,
}: FormFieldProps) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  
  return (
    <motion.div variants={itemVariants} className={`mb-4 ${className}`}>
      <TextField
        id={name}
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth={fullWidth || true}
        required={required}
        autoComplete={autoComplete}
        inputProps={inputProps}
      />
    </motion.div>
  );
};

export default FormField; 