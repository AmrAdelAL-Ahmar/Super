import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box, 
  Grid, 
  TextField, 
  Checkbox
} from '@mui/material';
import { Address } from '@/services/checkoutService';

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddress: string;
  isNewAddress: boolean;
  newAddress: Address;
  onAddressSelection: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetDefaultAddress: (isDefault: boolean) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  selectedAddress,
  isNewAddress,
  newAddress,
  onAddressSelection,
  onNewAddressChange,
  onSetDefaultAddress
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <div>
      <Typography variant="h5" className="mb-4">
        {t('checkout.shippingAddress')}
      </Typography>
      
      <RadioGroup
        value={isNewAddress ? 'new' : selectedAddress}
        onChange={onAddressSelection}
      >
        {addresses.map((address) => (
          <FormControlLabel
            key={address.id || `address-${Math.random()}`}
            value={address.id || ''}
            control={<Radio />}
            label={
              <Box className="ml-2">
                <Typography variant="subtitle1" className="font-medium">
                  {locale === 'ar' ? address.nameAr : address.name}
                  {address.isDefault && (
                    <span className="ml-2 text-sm text-primary-600">
                      ({t('profile.defaultAddress')})
                    </span>
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {address.recipient}, {address.street}, {address.city}, {address.state} {address.zipCode}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {address.phone}
                </Typography>
              </Box>
            }
            className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
          />
        ))}
        
        <FormControlLabel
          value="new"
          control={<Radio />}
          label={
            <Typography variant="subtitle1" className="font-medium">
              {t('checkout.addNewAddress')}
            </Typography>
          }
          className="mt-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
        />
      </RadioGroup>
      
      {isNewAddress && (
        <Grid container spacing={2} className="mt-4">
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('profile.addressName')}
              name="name"
              value={newAddress.name}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('profile.recipient')}
              name="recipient"
              value={newAddress.recipient}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label={t('profile.streetAddress')}
              name="street"
              value={newAddress.street}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('profile.city')}
              name="city"
              value={newAddress.city}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('profile.zipCode')}
              name="zipCode"
              value={newAddress.zipCode}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label={t('profile.phone')}
              name="phone"
              value={newAddress.phone}
              onChange={onNewAddressChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!newAddress.isDefault}
                  onChange={(e) => onSetDefaultAddress(e.target.checked)}
                  color="primary"
                />
              }
              label={t('profile.setAsDefault')}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AddressSelection; 