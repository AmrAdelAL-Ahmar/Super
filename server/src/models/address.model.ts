import mongoose, { Document, Schema, Types } from 'mongoose';
import { IAddress } from 'src/interfaces/models/address.interface';


export interface IAddressDocument extends Omit<IAddress, '_id' | "userId">, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}

const addressSchema = new Schema<IAddressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
addressSchema.index({ userId: 1 });
addressSchema.index({ 'coordinates': '2dsphere' });

// Method to set as default address
addressSchema.methods.setAsDefault = async function(): Promise<void> {
  // First, set all addresses of this user as non-default
  await mongoose.model('Address').updateMany(
    { userId: this.userId },
    { $set: { isDefault: false } }
  );

  // Then set this address as default
  this.isDefault = true;
  await this.save();
};

// Static method to find addresses by user
addressSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

// Static method to find default address
addressSchema.statics.findDefaultAddress = function(userId: string) {
  return this.findOne({ userId, isDefault: true });
};

// Static method to find nearby addresses
addressSchema.statics.findNearby = function(
  coordinates: { latitude: number; longitude: number },
  maxDistance: number
) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
        $maxDistance: maxDistance * 1000, // Convert to meters
      },
    },
  });
};

const AddressModel = mongoose.model<IAddressDocument>('Address', addressSchema);

export default AddressModel; 