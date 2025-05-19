import React from 'react';
import { useTranslation } from 'next-i18next';
import { 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box, 
  TextField, 
  Divider, 
  Alert 
} from '@mui/material';

interface PaymentMethodSelectionProps {
  paymentMethod: string;
  orderNotes: string;
  onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderNotesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethod,
  orderNotes,
  onPaymentMethodChange,
  onOrderNotesChange
}) => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <Typography variant="h5" className="mb-4">
        {t('checkout.paymentMethod')}
      </Typography>
      
      <RadioGroup
        value={paymentMethod}
        onChange={onPaymentMethodChange}
      >
        <FormControlLabel
          value="cash"
          control={<Radio />}
          label={
            <Box className="ml-2">
              <Typography variant="subtitle1" className="font-medium">
                {t('checkout.cashOnDelivery')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('checkout.payWithCash')}
              </Typography>
            </Box>
          }
          className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
        />
        
        <FormControlLabel
          value="card"
          control={<Radio />}
          label={
            <Box className="ml-2">
              <Typography variant="subtitle1" className="font-medium">
                {t('checkout.creditCard')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('checkout.payWithCard')}
              </Typography>
            </Box>
          }
          className="mb-2 border border-gray-200 rounded-md p-2 hover:border-primary-300"
        />
      </RadioGroup>
      
      {paymentMethod === 'card' && (
        <Alert severity="info" className="mt-4">
          {t('checkout.cardPaymentMessage')}
        </Alert>
      )}
      
      <Divider className="my-6" />
      
      <Typography variant="h6" className="mb-3">
        {t('checkout.notes')}
      </Typography>
      
      <TextField
        label={t('checkout.orderNotes')}
        value={orderNotes}
        onChange={onOrderNotesChange}
        multiline
        rows={4}
        fullWidth
        placeholder={t('checkout.notesPlaceholder') || ''}
      />
    </div>
  );
};

export default PaymentMethodSelection; 