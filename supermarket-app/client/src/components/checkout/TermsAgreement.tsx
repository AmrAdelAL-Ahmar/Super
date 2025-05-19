import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FormControlLabel, Checkbox } from '@mui/material';

interface TermsAgreementProps {
  agreedToTerms: boolean;
  onAgreeChange: (agreed: boolean) => void;
  className?: string;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreedToTerms,
  onAgreeChange,
  className = ''
}) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={className}>
      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => onAgreeChange(e.target.checked)}
            color="primary"
            required
          />
        }
        label={
          <span>
            {t('checkout.agreeToTerms')}{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
              {t('checkout.termsLink')}
            </Link>
          </span>
        }
      />
    </div>
  );
};

export default TermsAgreement; 