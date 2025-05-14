import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { 
  Typography, Box, Paper, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, IconButton, Alert, Snackbar
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import { RootState } from '@/store';

// Mock employee data for initial development
// This should be replaced with API calls to fetch actual employees
const mockEmployees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    deliveries: 24
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    status: 'inactive',
    deliveries: 12
  }
];

const EmployeesPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(mockEmployees);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has owner role
    if (!user) {
      router.push('/login?returnUrl=/dashboard/employees');
      return;
    }

    if (user.role !== 'owner') {
      router.push('/');
      return;
    }

    // Here you would fetch the actual employees from your API
    // const fetchEmployees = async () => {
    //   try {
    //     const response = await axios.get('/api/employees');
    //     setEmployees(response.data);
    //   } catch (error) {
    //     console.error('Error fetching employees:', error);
    //     showAlertMessage('Failed to load employees', 'error');
    //   }
    // };
    
    // fetchEmployees();
    setLoading(false);
  }, [user, router]);

  const handleAddEmployee = () => {
    router.push('/dashboard/employees/new');
  };

  const handleEditEmployee = (id: string) => {
    router.push(`/dashboard/employees/edit/${id}`);
  };

  const handleDeleteEmployee = (id: string) => {
    // Here you would call your API to delete the employee
    // For now, we'll just remove it from the local state
    if (window.confirm(t('owner.confirmDeleteEmployee') || 'Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      showAlertMessage(t('owner.employeeDeleted') || 'Employee deleted successfully', 'success');
    }
  };

  const showAlertMessage = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <Box className="flex justify-center items-center h-screen">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box className="max-w-7xl mx-auto py-8 px-4">
        <Box className="flex items-center mb-6">
          <IconButton onClick={() => router.push('/dashboard')} className="mr-2">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('owner.employees')}
          </Typography>
        </Box>

        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h6">
            {t('owner.employeeList')}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            {t('owner.addEmployee')}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('auth.name') || 'Name'}</TableCell>
                <TableCell>{t('auth.email') || 'Email'}</TableCell>
                <TableCell>{t('auth.phone') || 'Phone'}</TableCell>
                <TableCell>{t('owner.status') || 'Status'}</TableCell>
                <TableCell>{t('owner.deliveries') || 'Deliveries'}</TableCell>
                <TableCell>{t('common.actions') || 'Actions'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {employee.status === 'active' ? 
                          (t('owner.statusActive') || 'Active') : 
                          (t('owner.statusInactive') || 'Inactive')}
                      </span>
                    </TableCell>
                    <TableCell>{employee.deliveries}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditEmployee(employee.id)} 
                        aria-label={t('common.edit') || 'Edit'}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteEmployee(employee.id)} 
                        aria-label={t('common.delete') || 'Delete'}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {t('owner.noEmployees') || 'No employees found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default EmployeesPage; 