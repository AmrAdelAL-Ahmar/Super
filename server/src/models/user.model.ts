import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserRole } from '../interfaces/models/user.interface';
import { hashPassword } from '../utils/password.util';

// const addressSchema = new Schema({
//   street: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   country: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   isDefault: { type: Boolean, default: false }
// });

export interface IUserDocument extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  storeId: Schema.Types.ObjectId;
  isActive: boolean;
  isEmailVerified: boolean;
  addresses: Schema.Types.ObjectId[];
  deliveryLocation?: {
    type: string;
    coordinates: number[];
  };
  lastLogin?: Date;
  lastLogout?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  addresses: [{type: Schema.Types.ObjectId, ref: 'Address'}],
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  lastLogin: {
    type: Date
  },
  lastLogout: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'deliveryLocation': '2dsphere' });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to verify password
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

// Methods
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpire;
  return obj;
};

const UserModel = mongoose.model<IUserDocument>('User', userSchema);
export default UserModel; 