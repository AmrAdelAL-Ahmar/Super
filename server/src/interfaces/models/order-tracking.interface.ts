import { Document } from 'mongoose';

// حالة التتبع | Tracking Status
export enum TrackingStatus {
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED'
}

// واجهة تتبع الطلب | Order Tracking Interface
export interface IOrderTracking extends Document {
  _id: string;
  orderId: string;
  deliveryEmployeeId: string;
  status: TrackingStatus;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  estimatedDeliveryTime: Date;
  checkpoints: ITrackingCheckpoint[];
  createdAt: Date;
  updatedAt: Date;
}

// واجهة نقطة تفتيش التتبع | Tracking Checkpoint Interface
export interface ITrackingCheckpoint {
  status: TrackingStatus;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  notes?: string;
}

// طلب تحديث التتبع | Update Tracking Request
export interface IUpdateTrackingRequest {
  location: {
    lat: number;
    lng: number;
  };
  status: TrackingStatus;
  estimatedDeliveryTime?: Date;
  notes?: string;
} 