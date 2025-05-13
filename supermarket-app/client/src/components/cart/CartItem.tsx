import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  IconButton, 
  TextField, 
  Card, 
  CardMedia, 
  Divider 
} from '@mui/material';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface CartItemProps {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  stock: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isLast: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  nameAr,
  price,
  quantity,
  image,
  unit,
  stock,
  onQuantityChange,
  onRemove,
  isLast
}) => {
  const router = useRouter();
  const locale = router.locale || 'en';
  
  return (
    <Box className="mb-4">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} sm={2}>
          <Card className="h-24 w-24 overflow-hidden">
            <CardMedia
              component="img"
              image={image}
              alt={locale === 'ar' ? nameAr : name}
              className="h-full w-full object-cover"
            />
          </Card>
        </Grid>
        
        <Grid item xs={9} sm={4}>
          <Typography variant="h6" className="text-gray-800">
            {locale === 'ar' ? nameAr : name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ${price.toFixed(2)} / {unit}
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Box className="flex items-center">
            <IconButton 
              size="small" 
              onClick={() => onQuantityChange(id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </IconButton>
            
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  onQuantityChange(id, value);
                }
              }}
              inputProps={{ min: 1, max: stock }}
              size="small"
              className="w-16 mx-2"
            />
            
            <IconButton 
              size="small" 
              onClick={() => onQuantityChange(id, quantity + 1)}
              disabled={quantity >= stock}
            >
              <PlusIcon className="h-4 w-4" />
            </IconButton>
          </Box>
        </Grid>
        
        <Grid item xs={4} sm={2} className="text-right">
          <Typography variant="h6" className="text-gray-800">
            ${(price * quantity).toFixed(2)}
          </Typography>
        </Grid>
        
        <Grid item xs={2} sm={1} className="text-right">
          <IconButton 
            color="error" 
            onClick={() => onRemove(id)}
          >
            <TrashIcon className="h-5 w-5" />
          </IconButton>
        </Grid>
      </Grid>
      
      {/* Divider after each item except the last one */}
      {!isLast && <Divider className="my-4" />}
    </Box>
  );
};

export default CartItem; 