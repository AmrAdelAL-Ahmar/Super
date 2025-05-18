import { Document } from 'mongoose';
import { IAddress } from './address.interface';

// واجهة المتجر | Store Interface
export interface IStoreLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface IStore extends Document {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address:IAddress;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  deliverySettings: {
    isDeliveryAvailable: boolean;
    deliveryRadius: number;
    minimumOrderAmount: number;
    deliveryFee: number;
    estimatedDeliveryTime: number;
  };
  paymentMethods: string[];
  isActive: boolean;
  rating: number;
  totalReviews: number;
  location: IStoreLocation;
  createdAt: Date;
  updatedAt: Date;
}