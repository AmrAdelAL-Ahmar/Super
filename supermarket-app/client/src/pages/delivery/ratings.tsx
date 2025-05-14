import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Rating as MuiRating,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import DeliveryLayout from '@/layouts/DeliveryLayout';
import { Rating, RatingSummary } from '@/types/delivery';
import { getDeliveryRatings, getDeliveryRatingSummary } from '@/services/deliveryService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function DeliveryRatings() {
  const { t } = useTranslation();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsData, summaryData] = await Promise.all([
          getDeliveryRatings(),
          getDeliveryRatingSummary()
        ]);
        
        setRatings(ratingsData);
        setSummary(summaryData);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const getRatingLabel = (value: number): string => {
    if (value >= 4.5) return t('delivery.ratings.excellent');
    if (value >= 3.5) return t('delivery.ratings.good');
    if (value >= 2.5) return t('delivery.ratings.average');
    if (value >= 1.5) return t('delivery.ratings.poor');
    return t('delivery.ratings.terrible');
  };

  const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getRatingColor = (value: number): string => {
    if (value >= 4.5) return 'success.main';
    if (value >= 3.5) return 'success.light';
    if (value >= 2.5) return 'warning.main';
    if (value >= 1.5) return 'warning.dark';
    return 'error.main';
  };

  const getPercentage = (count: number, total: number): number => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </DeliveryLayout>
    );
  }

  if (error) {
    return (
      <DeliveryLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t('delivery.ratings.title')}
        </Typography>

        {summary && ratings.length > 0 ? (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('delivery.ratings.overview')}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ color: getRatingColor(summary.average) }}>
                      {summary.average.toFixed(1)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      <MuiRating value={summary.average} precision={0.1} readOnly />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('delivery.ratings.totalRatings')}: {summary.total}
                    </Typography>
                    <Chip 
                      label={getRatingLabel(summary.average)} 
                      sx={{ 
                        mt: 1, 
                        bgcolor: getRatingColor(summary.average),
                        color: 'white'
                      }} 
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ minWidth: '30px' }}>{rating}</Typography>
                        <Box sx={{ width: '100%', mx: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getPercentage(summary.distribution[rating as keyof typeof summary.distribution], summary.total)}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: 'grey.300',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getRatingColor(rating),
                                borderRadius: 5
                              }
                            }}
                          />
                        </Box>
                        <Typography sx={{ minWidth: '40px' }}>
                          {summary.distribution[rating as keyof typeof summary.distribution]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h6" gutterBottom>
              {t('delivery.ratings.recentRatings')}
            </Typography>

            {ratings.map((rating) => (
              <Card key={rating.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: getRatingColor(rating.value), mr: 2 }}>
                        {rating.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {rating.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('delivery.ratings.on')} {getFormattedDate(rating.date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <MuiRating value={rating.value} readOnly />
                      <Typography variant="body2" sx={{ color: getRatingColor(rating.value) }}>
                        {getRatingLabel(rating.value)}
                      </Typography>
                    </Box>
                  </Box>

                  {rating.comment && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('delivery.ratings.comment')}:
                        </Typography>
                        <Typography variant="body2">
                          "{rating.comment}"
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {t('delivery.ratings.noRatings')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('delivery.ratings.noRatingsDescription')}
            </Typography>
          </Paper>
        )}
      </Box>
    </DeliveryLayout>
  );
} export async function getServerSideProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }
  