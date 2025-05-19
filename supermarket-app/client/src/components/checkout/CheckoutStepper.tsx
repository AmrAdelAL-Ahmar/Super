import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { motion } from 'framer-motion';

interface CheckoutStepperProps {
  steps: string[];
  activeStep: number;
  className?: string;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  steps,
  activeStep,
  className = ''
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
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </motion.div>
  );
};

export default CheckoutStepper; 