import { Document } from 'mongoose';
import { IAddress } from './address.interface';

// أدوار المستخدم | User Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
  DELIVERY = 'DELIVERY'
}



// واجهة المستخدم | User Interface
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  storeId?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  addresses?: IAddress[];
  deliveryLocation?: {
    type: string;
    coordinates: number[];
  };
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOwner extends IUser {
  storeId: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeLogo?: string;
}

export interface ICustomer extends IUser {
  addresses: IAddress[];
  defaultAddressId?: string;
  orders: string[];
  cart: string;
}

export interface IDeliveryEmployee extends IUser {
  employeeId: string;
  storeId: string;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  deliveredOrders: number;
  rating: number;
  schedule: {
    monday: { isWorking: boolean; startTime?: string; endTime?: string };
    tuesday: { isWorking: boolean; startTime?: string; endTime?: string };
    wednesday: { isWorking: boolean; startTime?: string; endTime?: string };
    thursday: { isWorking: boolean; startTime?: string; endTime?: string };
    friday: { isWorking: boolean; startTime?: string; endTime?: string };
    saturday: { isWorking: boolean; startTime?: string; endTime?: string };
    sunday: { isWorking: boolean; startTime?: string; endTime?: string };
  };
} 