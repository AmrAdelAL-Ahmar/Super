import mongoose, { Document, Schema } from 'mongoose';
import { IStore, IStoreLocation } from '../interfaces/models/store.interface';

export interface IStoreDocument extends Document {
  ownerId: Schema.Types.ObjectId;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: Schema.Types.ObjectId;
  location: IStoreLocation;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: Map<string, {
    open: string;
    close: string;
    isClosed: boolean;
  }>;
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
  createdAt: Date;
  updatedAt: Date;
  isOpen(): boolean;
  updateBusinessHours(day: string, hours: { open: string; close: string; isClosed: boolean }): Promise<void>;
  updateDeliverySettings(settings: Partial<IStore['deliverySettings']>): Promise<void>;
}

const storeSchema = new Schema<IStoreDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    location: {
      type: String,
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      website: String,
    },
    businessHours: {
      type: Map,
      of: new Schema({
        open: String,
        close: String,
        isClosed: Boolean
      }, { _id: false }),
      default: new Map([
        ['monday', { open: '09:00', close: '18:00', isClosed: false }],
        ['tuesday', { open: '09:00', close: '18:00', isClosed: false }],
        ['wednesday', { open: '09:00', close: '18:00', isClosed: false }],
        ['thursday', { open: '09:00', close: '18:00', isClosed: false }],
        ['friday', { open: '09:00', close: '18:00', isClosed: false }],
        ['saturday', { open: '09:00', close: '18:00', isClosed: false }],
        ['sunday', { open: '09:00', close: '18:00', isClosed: true }]
      ])
    },
    deliverySettings: {
      isDeliveryAvailable: {
        type: Boolean,
        default: true,
      },
      deliveryRadius: {
        type: Number,
        default: 10, // in kilometers
      },
      minimumOrderAmount: {
        type: Number,
        default: 0,
      },
      deliveryFee: {
        type: Number,
        default: 0,
      },
      estimatedDeliveryTime: {
        type: Number,
        default: 30, // in minutes
      },
    },
    paymentMethods: [{
      type: String,
      enum: ['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'DIGITAL_WALLET'],
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
storeSchema.index({ name: 'text', description: 'text' });
storeSchema.index({ 'address.coordinates': '2dsphere' });
storeSchema.index({ ownerId: 1 });

// Method to check if store is open
storeSchema.methods.isOpen = function(): boolean {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
  
  const hours = this.businessHours.get(day);
  if (!hours || hours.isClosed) {
    return false;
  }

  return currentTime >= hours.open && currentTime <= hours.close;
};

// Method to update business hours
storeSchema.methods.updateBusinessHours = async function(
  day: string,
  hours: { open: string; close: string; isClosed: boolean }
): Promise<void> {
  this.businessHours.set(day, hours);
  await this.save();
};

// Method to update delivery settings
storeSchema.methods.updateDeliverySettings = async function(
  settings: Partial<IStore['deliverySettings']>
): Promise<void> {
  this.deliverySettings = { ...this.deliverySettings, ...settings };
  await this.save();
};

// Static method to find nearby stores
storeSchema.statics.findNearby = function(
  coordinates: { latitude: number; longitude: number },
  maxDistance: number
) {
  return this.find({
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
        $maxDistance: maxDistance * 1000, // Convert to meters
      },
    },
    isActive: true,
  });
};

const StoreModel = mongoose.model<IStoreDocument>('Store', storeSchema);

export default StoreModel; 