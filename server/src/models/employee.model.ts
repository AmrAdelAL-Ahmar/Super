import mongoose, { Document, Schema } from 'mongoose';
import { IDeliveryEmployee, UserRole } from '../interfaces/models/user.interface';

export interface IEmployeeDocument extends Document {
  _id: Schema.Types.ObjectId;
  email: string;                                                                                                                                                                                                                           
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  employeeId: string;
  storeId: Schema.Types.ObjectId;
  isAvailable: boolean;
  currentLocation: {
    lat: number;
    lng: number;
  };
  schedule?: {
    monday?: { isWorking: boolean; startTime?: string; endTime?: string };
    tuesday?: { isWorking: boolean; startTime?: string; endTime?: string };
    wednesday?: { isWorking: boolean; startTime?: string; endTime?: string };
    thursday?: { isWorking: boolean; startTime?: string; endTime?: string };
    friday?: { isWorking: boolean; startTime?: string; endTime?: string };
    saturday?: { isWorking: boolean; startTime?: string; endTime?: string };
    sunday?: { isWorking: boolean; startTime?: string; endTime?: string };
  };
  deliveredOrders: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployeeDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    schedule: {
      type: {
        monday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },
        tuesday: {
          isWorking: { type: Boolean, default: false }, 
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },
        wednesday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },
        thursday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },
        friday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },
        saturday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' }, 
        },
        sunday: {
          isWorking: { type: Boolean, default: false },
          startTime: { type: String, default: '' },
          endTime: { type: String, default: '' },
        },    
      },
      default: {},
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [UserRole.DELIVERY],
      default: UserRole.DELIVERY,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      // required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    deliveredOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Method to update location
employeeSchema.methods.updateLocation = async function(lat: number, lng: number): Promise<void> {
  this.currentLocation = { lat, lng };
  await this.save();
};

// Method to update availability
employeeSchema.methods.updateAvailability = async function(isAvailable: boolean): Promise<void> {
  this.isAvailable = isAvailable;
  await this.save();
};

// Method to increment delivered orders
employeeSchema.methods.incrementDeliveredOrders = async function(): Promise<void> {
  this.deliveredOrders += 1;
  await this.save();
};

// Method to update rating
employeeSchema.methods.updateRating = async function(newRating: number): Promise<void> {
  const totalRating = (this.rating * this.deliveredOrders) + newRating;
  this.deliveredOrders += 1;
  this.rating = totalRating / this.deliveredOrders;
  await this.save();
};

const EmployeeModel = mongoose.model<IEmployeeDocument>('Employee', employeeSchema);

export default EmployeeModel; 