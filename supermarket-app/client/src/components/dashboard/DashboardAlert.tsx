import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AlertSeverity } from '@/types/dashboard';

interface DashboardAlertProps {
  open: boolean;
  message: string;
  severity: AlertSeverity;
  onClose: () => void;
  autoHideDuration?: number;
}

const DashboardAlert: React.FC<DashboardAlertProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000
}) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default DashboardAlert; 