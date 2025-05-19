import mongoose, { Schema, Document, Types } from 'mongoose';
import { IOrderTracking, TrackingStatus } from '../interfaces/models/order-tracking.interface';

// Interface for the OrderTracking document with typed ObjectId
export interface IOrderTrackingDocument extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  deliveryEmployeeId: Types.ObjectId;
  status: TrackingStatus;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  estimatedDeliveryTime: Date;
  checkpoints: Array<{
    status: TrackingStatus;
    location: {
      lat: number;
      lng: number;
    };
    timestamp: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  addCheckpoint: (status: TrackingStatus, location: { lat: number; lng: number }, notes?: string) => Promise<void>;
  updateEstimatedDeliveryTime: (estimatedDeliveryTime: Date) => Promise<void>;
}

// Schema for Tracking Checkpoint
const trackingCheckpointSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(TrackingStatus),
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

// Schema for Order Tracking
const orderTrackingSchema = new Schema<IOrderTrackingDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    deliveryEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TrackingStatus),
      default: TrackingStatus.PICKED_UP,
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    estimatedDeliveryTime: {
      type: Date,
      required: true,
    },
    checkpoints: [trackingCheckpointSchema],
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
orderTrackingSchema.index({ orderId: 1, createdAt: -1 });

// Method to add a checkpoint
orderTrackingSchema.methods.addCheckpoint = async function(
  status: TrackingStatus,
  location: { lat: number; lng: number },
  notes?: string
): Promise<void> {
  this.status = status;
  this.location = location;
  this.timestamp = new Date();
  
  this.checkpoints.push({
    status,
    location,
    timestamp: new Date(),
    notes,
  });
  
  await this.save();
};

// Method to update estimated delivery time
orderTrackingSchema.methods.updateEstimatedDeliveryTime = async function(
  estimatedDeliveryTime: Date
): Promise<void> {
  this.estimatedDeliveryTime = estimatedDeliveryTime;
  await this.save();
};

const OrderTrackingModel = mongoose.model<IOrderTrackingDocument>('OrderTracking', orderTrackingSchema);

export default OrderTrackingModel; 