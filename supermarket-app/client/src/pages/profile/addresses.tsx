import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { Typography, Box, Paper, Button, Card, CardContent, 
  CardActions, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Grid, Alert, Tooltip, Breadcrumbs } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, 
  Home as HomeIcon, LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MainLayout from '@/layouts/MainLayout';
import FormField from '@/components/auth/FormField';
import SubmitButton from '@/components/auth/SubmitButton';
import { RootState } from '@/store';
import { Address } from '@/types/user';
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '@/services/authService';

/**
 * Initial address form state
 */
const initialFormState = {
  address: '',
  city: '',
  lat: '',
  lng: '',
  isDefault: false,
};

/**
 * Address management page component
 */
const AddressPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  
  /**
   * Go back to profile page
   */
  const goToProfile = () => {
    router.push('/profile');
  };
  
  /**
   * Fetch addresses on component mount
   */
  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/profile/addresses');
      return;
    }
    
    fetchAddresses();
  }, [user, router]);
  
  /**
   * Fetch user addresses from API
   */
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const addressList = await getUserAddresses();
      setAddresses(addressList);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(t('addresses.fetchError') || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Open the address dialog for add/edit
   */
  const handleOpenDialog = (address: Address | null = null) => {
    resetMessages();
    
    if (address) {
      // Edit mode
      setEditingAddress(address);
      setFormData({
        address: address.address,
        city: address.city,
        lat: address.coordinates.lat.toString(),
        lng: address.coordinates.lng.toString(),
        isDefault: address.isDefault,
      });
    } else {
      // Add mode
      setEditingAddress(null);
      setFormData({
        ...initialFormState,
        isDefault: addresses.length === 0, // Make first address default
      });
    }
    setOpenDialog(true);
  };
  
  /**
   * Close the address dialog
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetMessages();
  };
  
  /**
   * Reset success and error messages
   */
  const resetMessages = () => {
    setSuccess('');
    setError('');
  };
  
  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  /**
   * Submit form to add/edit address
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();
    
    try {
      // Validate coordinates
      const lat = parseFloat(formData.lat);
      const lng = parseFloat(formData.lng);
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
      }
      
      const addressData: Omit<Address, '_id'> = {
        address: formData.address,
        city: formData.city,
        coordinates: { lat, lng },
        isDefault: formData.isDefault,
      };
      
      if (editingAddress && editingAddress._id) {
        // Update existing address
        await updateAddress(editingAddress._id!, addressData);
        setSuccess(t('addresses.updateSuccess') || 'Address updated successfully');
      } else {
        // Add new address
        await addAddress(addressData);
        setSuccess(t('addresses.addSuccess') || 'Address added successfully');
      }
      
      // Refresh address list
      await fetchAddresses();
      handleCloseDialog();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.error || t('addresses.saveError') || 'Failed to save address');
      } else {
        setError(t('addresses.saveError') || 'Failed to save address');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete an address
   */
  const handleDelete = async (addressId: string) => {
    if (!window.confirm(t('addresses.confirmDelete') || 'Are you sure you want to delete this address?')) {
      return;
    }
    
    setLoading(true);
    resetMessages();
    
    try {
      await deleteAddress(addressId);
      setSuccess(t('addresses.deleteSuccess') || 'Address deleted successfully');
      
      // Refresh address list
      await fetchAddresses();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.error || t('addresses.deleteError') || 'Failed to delete address');
      } else {
        setError(t('addresses.deleteError') || 'Failed to delete address');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Set an address as default
   */
  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    resetMessages();
    
    try {
      await updateAddress(addressId, { isDefault: true });
      setSuccess(t('addresses.defaultSuccess') || 'Default address updated');
      
      // Refresh address list
      await fetchAddresses();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.error || t('addresses.updateError') || 'Failed to update address');
      } else {
        setError(t('addresses.updateError') || 'Failed to update address');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect to login if no user is found
  if (!user) {
    return null; // Will redirect to login in useEffect
  }
  
  return (
    <MainLayout>
      <Box className="max-w-5xl mx-auto py-8 px-4">
        {/* Navigation */}
        <Box className="mb-4">
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/profile" className="text-primary-600 hover:underline flex items-center">
              <span>{t('profile.title') || 'My Profile'}</span>
            </Link>
            <Typography color="textPrimary">{t('addresses.title') || 'My Addresses'}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Box className="flex justify-between items-center mb-6">
          <Box className="flex items-center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={goToProfile}
              className="mr-4"
            >
              {t('common.back') || 'Back'}
            </Button>
            <Typography variant="h4" component="h1">
              {t('addresses.title') || 'My Addresses'}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('addresses.addNew') || 'Add New Address'}
          </Button>
        </Box>
        
        {success && <Alert severity="success" className="mb-4">{success}</Alert>}
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <Paper elevation={3} className="p-4">
          {addresses.length === 0 ? (
            <EmptyAddressList onAddClick={() => handleOpenDialog()} />
          ) : (
            <AddressList 
              addresses={addresses}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              loading={loading}
            />
          )}
        </Paper>
      </Box>
      
      <AddressDialog
        open={openDialog}
        onClose={handleCloseDialog}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={!!editingAddress}
        loading={loading}
        error={error}
      />
    </MainLayout>
  );
};

/**
 * Empty address list component
 */
interface EmptyAddressListProps {
  onAddClick: () => void;
}

const EmptyAddressList = ({ onAddClick }: EmptyAddressListProps) => {
  const { t } = useTranslation('common');
  
  return (
    <Box className="py-8 text-center">
      <Typography variant="body1" className="mb-4">
        {t('addresses.noAddresses') || 'You have no saved addresses'}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
      >
        {t('addresses.addFirst') || 'Add Your First Address'}
      </Button>
    </Box>
  );
};

/**
 * Address list component
 */
interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  loading: boolean;
}

const AddressList = ({ addresses, onEdit, onDelete, onSetDefault, loading }: AddressListProps) => {
  const { t } = useTranslation('common');
  
  return (
    <Grid container spacing={3}>
      {addresses.map((address) => (
        <Grid item xs={12} md={6} key={address._id}>
          <Card className={address.isDefault ? 'border-2 border-primary-500' : ''}>
            <CardContent>
              {address.isDefault && (
                <Box className="flex items-center mb-2 text-primary-600">
                  <HomeIcon fontSize="small" className="mr-1" />
                  <Typography variant="subtitle2">
                    {t('addresses.defaultAddress') || 'Default Address'}
                  </Typography>
                </Box>
              )}
              
              <Typography variant="h6" gutterBottom>
                {address.address}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                {address.city}
              </Typography>
            </CardContent>
            
            <CardActions disableSpacing>
              {!address.isDefault && (
                <Button 
                  size="small" 
                  onClick={() => onSetDefault(address._id!)}
                >
                  {t('addresses.setAsDefault') || 'Set as Default'}
                </Button>
              )}
              
              <Box className="ml-auto flex">
                <Tooltip title={t('addresses.edit') || 'Edit'}>
                  <IconButton
                    aria-label="edit"
                    onClick={() => onEdit(address)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={t('addresses.delete') || 'Delete'}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => onDelete(address._id!)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Address dialog component
 */
interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  formData: typeof initialFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  loading: boolean;
  error: string;
}

const AddressDialog = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSubmit, 
  isEditing, 
  loading, 
  error 
}: AddressDialogProps) => {
  const { t } = useTranslation('common');
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditing 
          ? (t('addresses.editAddress') || 'Edit Address') 
          : (t('addresses.addAddress') || 'Add Address')}
      </DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
          <FormField
            name="address"
            label={t('addresses.streetAddress') || 'Street Address'}
            value={formData.address}
            onChange={onChange}
            required
            className="w-full"
            fullWidth
          />
          
          <FormField
            name="city"
            label={t('addresses.city') || 'City'}
            value={formData.city}
            onChange={onChange}
            required
            className="w-full"
            fullWidth
          />
          
          <Box className="flex gap-4">
            <FormField
              name="lat"
              label={t('addresses.latitude') || 'Latitude'}
              value={formData.lat}
              onChange={onChange}
              required
              className="w-full"
              fullWidth
              type="number"
              inputProps={{ step: "0.000001" }}
            />
            
            <FormField
              name="lng"
              label={t('addresses.longitude') || 'Longitude'}
              value={formData.lng}
              onChange={onChange}
              required
              className="w-full"
              fullWidth
              type="number"
              inputProps={{ step: "0.000001" }}
            />
          </Box>
          
          <Box className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={onChange}
              className="mr-2"
            />
            <label htmlFor="isDefault">
              {t('addresses.makeDefault') || 'Make this my default address'}
            </label>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('common.cancel') || 'Cancel'}
          </Button>
          
          <SubmitButton
            loading={loading}
            label={isEditing 
              ? (t('addresses.update') || 'Update') 
              : (t('addresses.add') || 'Add')}
            variant="contained"
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AddressPage; 