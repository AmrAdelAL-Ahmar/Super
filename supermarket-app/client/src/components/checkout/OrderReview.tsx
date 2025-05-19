import React from 'react';
import { useTranslation } from 'next-i18next';
import { Typography, Card, CardContent, Box } from '@mui/material';
import TermsAgreement from './TermsAgreement';
import { Address } from '@/services/checkoutService';

interface OrderReviewProps {
  address: Address;
  paymentMethod: string;
  orderNotes?: string;
  agreedToTerms: boolean;
  onAgreeChange: (agreed: boolean) => void;
  className?: string;
}

const OrderReview: React.FC<OrderReviewProps> = ({
  address,
  paymentMethod,
  orderNotes,
  agreedToTerms,
  onAgreeChange,
  className = ''
}) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={className}>
      <Typography variant="h5" className="mb-4">
        {t('checkout.reviewOrder')}
      </Typography>
      
      {/* Shipping Address */}
      <Card variant="outlined" className="mb-4">
        <CardContent>
          <Typography variant="h6" className="mb-2">
            {t('checkout.shippingAddress')}
          </Typography>
          
          <Box>
            <Typography variant="body1">{address.recipient}</Typography>
            <Typography variant="body2" color="textSecondary">
              {address.street}, {address.city}{address.state ? `, ${address.state}` : ''} {address.zipCode}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {address.phone}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Payment Method */}
      <Card variant="outlined" className="mb-4">
        <CardContent>
          <Typography variant="h6" className="mb-2">
            {t('checkout.paymentMethod')}
          </Typography>
          
          <Typography variant="body1">
            {paymentMethod === 'cash' ? t('checkout.cashOnDelivery') : t('checkout.creditCard')}
          </Typography>
        </CardContent>
      </Card>
      
      {/* Order Notes */}
      {orderNotes && (
        <Card variant="outlined" className="mb-4">
          <CardContent>
            <Typography variant="h6" className="mb-2">
              {t('checkout.notes')}
            </Typography>
            
            <Typography variant="body2">
              {orderNotes}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {/* Terms and Conditions */}
      <TermsAgreement 
        agreedToTerms={agreedToTerms}
        onAgreeChange={onAgreeChange}
        className="mt-4"
      />
    </div>
  );
};

export default OrderReview; 