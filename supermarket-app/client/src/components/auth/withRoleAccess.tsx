import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import { RootState } from '@/store';
import { UserRole } from '@/types/user';
import { PageAccessControl } from '@/types/dashboard';

/**
 * Higher-order component for role-based access control
 * 
 * @param WrappedComponent Component to wrap with access control
 * @param accessControl Access control configuration
 * @returns Component with role-based access control
 */
const withRoleAccess = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  accessControl: PageAccessControl
) => {
  const WithRoleAccess: React.FC<P> = (props) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      // Check if user is logged in
      if (!user) {
        router.push(`/login?returnUrl=${router.pathname}`);
        return;
      }

      // Check if user has required role
      if (user.role !== accessControl.requiredRole) {
        router.push(accessControl.redirectPath);
        return;
      }

      // User is authorized
      setAuthorized(true);
      setLoading(false);
    }, [user, router]);

    if (loading) {
      return (
        <Box className="flex justify-center items-center h-screen">
          <CircularProgress />
        </Box>
      );
    }

    if (authorized) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return WithRoleAccess;
};

export default withRoleAccess; 