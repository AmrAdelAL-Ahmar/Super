import React from 'react';
import { useRouter } from 'next/router';
import { 
  Typography, 
  Box, 
  IconButton 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface DashboardPageHeaderProps {
  title: string;
  backUrl?: string;
  actions?: React.ReactNode;
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  title,
  backUrl = '/dashboard',
  actions
}) => {
  const router = useRouter();
  
  return (
    <Box className="flex items-center justify-between mb-6">
      <Box className="flex items-center">
        <IconButton 
          onClick={() => router.push(backUrl)} 
          className="mr-2"
          aria-label="Back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      </Box>
      
      {actions && (
        <Box className="flex items-center">
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPageHeader; 